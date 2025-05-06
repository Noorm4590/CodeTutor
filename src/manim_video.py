from manim import *
import os

# Ensure MikTeX path is added
os.environ["PATH"] += r";C:\Program Files\MiKTeX\miktex\bin\x64\\"

def escape_special_characters(text):
    """
    Escapes special LaTeX characters in the input text for proper rendering in Manim.
    
    Args:
        text (str): The input text to process.
        
    Returns:
        str: The processed text with special characters escaped.
    """
    special_characters = "&%$#_{}~^\\"
    for char in special_characters:
        text = text.replace(char, "")
    return text

# Fetch dynamic content from environment variables
generated_title = os.environ.get("GENERATED_TITLE", "Default Title")
generated_content = eval(os.environ.get("GENERATED_CONTENT", "[]"))  # Expecting a Python list as a string

# Default content in case the environment variable is empty
if not generated_content:
    generated_content = [
        'The problem asks to find the length of the longest substring in a given string s without repeating characters.',
        'Use the sliding window technique where you maintain two pointers: a right pointer and a left pointer.',
        'Move the left pointer to explore the string and the right pointer to check if there is a substring with the same character as the current character. If there is, move both pointers inward.',
        'If there is no matching character, the substring has a shorter length.',
        'Keep track of the maximum length found during the iteration.',
        'Initialize two pointers, left and right, to the beginning of the string.',
        'While left pointer is less than or equal to right pointer:', 
        'Increment left if the character at left is a duplicate of a previous character in s.', 
        'Decrement right if the characters at right are not duplicates.', 
        'Update max_len as the maximum of either the maximum or the minimum of the two pointers.', 
        'Continue this process until no more duplicates are found.',
        'Return the max(len(left, right) + max(right) length, which represents the longest substring without repeating characters.'
    ]

# Escape special characters in the generated content
escaped_content = [escape_special_characters(item) for item in generated_content]

class BulletedListWithCartoon(Scene):
    def construct(self):
        # Add the title
        title = Text(generated_title, font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Load a cartoon character image
        cartoon_path = "./professor.jpg"
        if not os.path.exists(cartoon_path):
            self.play(Write(Text("Cartoon image missing!", font_size=24).to_edge(LEFT)))
            cartoon = None
        else:
            cartoon = ImageMobject(cartoon_path)
            cartoon.set_width(2).set_height(4).to_edge(LEFT)
            self.play(FadeIn(cartoon))
            self.wait(1)

        # Define the number of items per slide
        items_per_slide = 3
        duration_per_slide = 10  # seconds to display each slide

        # Split the content into chunks of items_per_slide bullet points
        slides = [
            escaped_content[i:i + items_per_slide]
            for i in range(0, len(escaped_content), items_per_slide)
        ]

        # Display each slide
        for slide in slides:
            bullets = BulletedList(*slide, font_size=28).to_edge(RIGHT)

            # Reveal each bullet point one by one
            for idx, bullet in enumerate(bullets):
                color = [RED, GREEN, BLUE]  # Rotate colors
                self.play(Write(bullet.set_color(color[idx % len(color)])))
                self.wait(1)  # Wait before showing the next bullet point

            self.wait(duration_per_slide)
            self.play(FadeOut(bullets))  # Transition to the next slide

        # Fade out everything at the end
        if cartoon:
            self.play(FadeOut(cartoon))
        self.play(FadeOut(title))
        self.wait(1)
