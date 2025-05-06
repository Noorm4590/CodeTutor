import imageio

# Path to the video file
video_path = "path_to_your_video.mp4"

# Open video using imageio
video = imageio.get_reader(video_path, 'ffmpeg')

# Loop through frames
for frame in video:
    print("Frame shape:", frame.shape)  # Display the frame dimensions (height, width, channels)
    # Add your processing logic here, if needed

# Close the video
video.close()
