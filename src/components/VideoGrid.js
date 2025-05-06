import React from "react";

// Update the video paths if needed, ensure they're in the public/videos folder.
const videos = [
  { id: 1, title: "Insertion in an Array ", url: "/videos/insertion-in-an-array-at-specific-idx.mp4" },
  { id: 2, title: "Deletion in an Array", url: "/videos/deletion-array.mp4" },
  { id: 3, title: "Heap Sort", url: "/videos/heap-sort.mp4" },
  // Add more videos as needed
];
const VideoGrid = () => {
  return (
    <div className="container mt-4">
      <h2>Available Courses</h2>
      <div className="row">
        {videos.map((video) => (
          <div className="col-md-4 mb-3" key={video.id}>
            <div className="card">
              <video 
                src={video.url} 
                className="card-img-top"
                style={{ width: "100%", height: "auto" }}
                controls
              ></video>
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
