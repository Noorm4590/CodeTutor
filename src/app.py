from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
import os
import pandas as pd
import streamlit as st
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chat_models import init_chat_model
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import subprocess
import pickle
from pymongo import MongoClient
import bcrypt
import re
from bson import ObjectId
from flask import make_response
import base64
import av


os.environ["GROQ_API_KEY"] = "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"

load_dotenv()

        # Get API Key from .env  
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

        # Initialize LLaMA 3 model from Groq
llm = init_chat_model("llama3-8b-8192", model_provider="groq", api_key=GROQ_API_KEY)

save_path = r"D:\code-tutor-ai\src\instructor_embeddings.pkl"

        # Load the embeddings from the file
with open(save_path, "rb") as f:
    instructor_embeddings = pickle.load(f)

faiss_path = r"D:\code-tutor-ai\src\faiss_index"


vectordb = FAISS.load_local(faiss_path,instructor_embeddings,allow_dangerous_deserialization=True)
retriever = vectordb.as_retriever(score_threshold=0.5)
prompt_template = """
You are an expert AI assistant specializing in Data Structures and Databases, particularly for solving LeetCode-style problems.
Your goal is to provide clear explanations and conceptual guidance based on the given information, without generating any code.

Instructions:
Use the provided context as much as possible to generate a relevant and accurate response.
If the user's question is not related to Data Structures, Databases, or Programming, politely respond with:
"I'm not sure I can help with that. Can you please rephrase or ask something related to programming?"
If the context does not contain the answer, respond only with:
"I don't know."
Do not provide any code snippets. Instead, focus on explanations, concepts, and problem-solving approaches.
Format responses using bullet points, where each point:
ends with .
Is clear, concise, and directly related to the query.

### **Provided Context:**
{context}

### **User Question:**
{question}

### **Answer:**
"""


PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        input_key="query",
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
        )
        

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
# Title for the generated video
generated_title = "Approach to Solve the Problem"

os.environ["PATH"] += r";C:\Program Files\MiKTeX\miktex\bin\x64\\"


client = MongoClient("mongodb://localhost:27017/")
db = client['codetutor']
users_collection = db['users']
video_history_collection = db['video_history']



def is_valid_password(password):
    return (
        re.search(r'[A-Z]', password) and
        re.search(r'[0-9]', password) and
        re.search(r'[^A-Za-z0-9]', password)
    )

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not is_valid_password(password):
        return jsonify({
            "status": "error",
            "message": "Password must contain at least one uppercase letter, one number, and one special character."
        }), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({
            "status": "error",
            "message": "Email already exists."
        }), 409

    # ✅ Hash the password before storing
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Save hashed password
    users_collection.insert_one({
        "full_name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({
        "status": "success",
        "message": "Account created successfully."
    }), 201

@app.route('/get_user', methods=['GET'])
def get_user():
    print("Session data:", dict(session))  
    if 'user_id' in session:
        return jsonify({
            'loggedIn': True,
            'full_name': session.get('full_name')
        })
    return jsonify({'loggedIn': False}), 401



@app.route('/get_session', methods=['GET'])
def get_session():
    user_id = session.get('user_id')
    full_name = session.get('full_name')
    if user_id and full_name:
        return jsonify({"user_id": user_id, "full_name": full_name}), 200
    return jsonify({"message": "No active session"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    response = make_response(jsonify({
        "status": "success",
        "message": "Logged out successfully."
    }))
    
    # Clear the session cookie explicitly
    response.set_cookie('session', '', expires=0)
    
    return response



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = users_collection.find_one({"email": email})
    if user:
        # Re-encode stored hash from string to bytes
        stored_hash = user['password'].encode('utf-8')

        if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            session['user_id'] = str(user['_id'])
            session['full_name'] = user['full_name']
            
            return jsonify({"message": "Login successful", "full_name": user['full_name']})
            

    return jsonify({"message": "Invalid email or password"}), 401


@app.route("/get_history", methods=["GET"])
def get_history():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session['user_id']
    history = list(video_history_collection.find({"user_id": user_id}))

    formatted = []
    for entry in history:
        formatted.append({
            "prompt": entry["prompt"],
            "video": entry["video_data"]
        })

    return jsonify(formatted)



# Function to split text into bullet points
def split_into_bullet_points(generated_text):
    """
    Splits a given text into bullet points.
    If the text contains newlines, split by '\n'.
    Otherwise, split by sentences using '. '.
    Also removes leading '-' characters from each bullet point.

    Parameters:
        generated_text (str): The input text to split.

    Returns:
        list: A list of bullet points.
    """
    if "\n" in generated_text:
        bullet_points = [line.strip().lstrip("-").strip() for line in generated_text.split("\n") if line.strip()]
    else:
        bullet_points = [
            sentence.strip().lstrip("-").strip()
            for sentence in generated_text.split(". ")  # Split by sentence endings
            if sentence.strip()
        ]
    return bullet_points



@app.route("/")
def home():

    return "Welcome to the Flask App!"




@app.route('/generate_video', methods=['POST'])
def generate_video():
    try:

        data = request.json
        input_text = data.get("prompt", "")
        print(f"Received prompt: {input_text}")
        
        if not input_text:
            return jsonify({"error": "No prompt provided"}), 400

        response = chain.invoke({"query": input_text})
        output_text=response["result"]

        # Split the output text into bullet points
        generated_content = split_into_bullet_points(output_text)

        # Log the generated content
        print(f"Generated content: {generated_content}")

        # Pass the generated title and content as environment variables
        os.environ["GENERATED_TITLE"] = generated_title
        os.environ["GENERATED_CONTENT"] = str(generated_content)

        # Render video using Manim
        manim_command = f"manim -pqm manim_video.py BulletedListWithCartoon"
        result = subprocess.run(manim_command, shell=True, capture_output=True)

        print(f"Manim stdout: {result.stdout.decode()}")
        print(f"Manim stderr: {result.stderr.decode()}")

        if result.returncode != 0:
            raise RuntimeError(f"Manim rendering failed: {result.stderr.decode()}")

        output_video = os.path.join(os.getcwd(), "media", "videos", "manim_video", "720p30", "BulletedListWithCartoon.mp4")

        if not os.path.exists(output_video):
            raise FileNotFoundError(f"Video file '{output_video}' not found.")
        
        print(f"Video successfully generated at {output_video}")
        
        # Return video file as response
        return send_file(output_video, as_attachment=True)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

    finally:
        os.environ.pop("GENERATED_TITLE", None)
        os.environ.pop("GENERATED_CONTENT", None)

    
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
