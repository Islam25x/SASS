const Documentation = () => {
    const documents = [
        {
            title: "User Guide",
            description: "A step-by-step guide to help you get started with the system.",
        },
        {
            title: "Technical Specifications",
            description:
                "Detailed technical specifications and requirements for the system.",
        },
        {
            title: "Gas Analysis Report",
            description: "Comprehensive gas analysis data and results.",
        },
        {
            title: "API Documentation",
            description: "Developer documentation for integrating with the API.",
        },
    ];

    return (
        <section id="Documentation">
            <div
                data-aos="zoom-in"
                data-aos-duration="500"
                className="bg-white border border-gray-200 h-fit p-6 relative rounded-lg shadow-sm"
            >
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                    Documentation
                </h2>

                {/* Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-4 border border-gray-200 hover:border-blue-400 rounded-lg"
                        >
                            <h3 className="text-lg font-medium mb-2 text-gray-900">
                                {doc.title}
                            </h3>
                            <p className="text-gray-600">{doc.description}</p>
                            <button className="inline-flex items-center justify-center text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 mt-3 rounded transition">
                                Download PDF
                            </button>
                        </div>
                    ))}
                </div>

                {/* Videos */}
                <h2 className="text-xl font-semibold my-6 text-gray-900">
                    Tutorial Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <iframe
                                className="w-full h-full rounded"
                                src="https://www.youtube.com/embed/6o5RprIJmfA"
                                title="Getting Started Guide"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h4 className="font-medium text-gray-900">Getting Started Guide</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Learn the basics of using the system in this quick start video.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                            <iframe
                                className="w-full h-full rounded"
                                src="https://www.youtube.com/embed/96Vekm8Ws4U"
                                title="Advanced Analysis Techniques"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <h4 className="font-medium text-gray-900">
                            Advanced Analysis Techniques
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                            Explore advanced techniques and best practices for data analysis.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Documentation;
