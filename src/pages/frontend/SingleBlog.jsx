import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function SingleBlog() {
    const { slug } = useParams(); 
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async () => {
        if (!slug) {
            setLoading(false);
            return;
        }
        
        try {
            console.log("Fetching blog with slug:", slug);
            // This endpoint uses the slug, which is correct based on the API definition
            const res = await axios.get(`http://localhost:5000/api/singleblogpost/${slug}`);
            setBlog(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load blog");
        } finally {
            setLoading(false);
        }
    };

    // The useEffect hook now correctly runs whenever the 'slug' changes.
    useEffect(() => {
        fetchBlog();
    }, [slug]);

    /**
     * Converts basic Markdown-like text (headings, lists) into HTML for better formatting.
     * NOTE: Using dangerouslySetInnerHTML with user-generated content carries an XSS security risk.
     * For production, always sanitize the content using a library like DOMPurify.
     */
    const formatContent = (content) => {
        if (!content) return null;

        const lines = content.split("\n").filter((l) => l.trim() !== "");
        const formatted = [];
        let listOpen = null; // Tracks current list type: 'ul', 'ol', or null

        const closeList = () => {
            if (listOpen) {
                formatted.push(`</${listOpen}>`);
                listOpen = null;
            }
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            // 1. Detect Headings (e.g., # Heading, ## Subheading)
            const headingMatch = trimmedLine.match(/^(#+)\s*(.*)/);
            if (headingMatch) {
                closeList();
                const level = Math.min(3, headingMatch[1].length); // Limit to H3
                const text = headingMatch[2].trim();
                formatted.push(`<h${level} class="text-${3 - level}xl font-bold mt-6 mb-3 text-gray-800">${text}</h${level}>`);
                return;
            }

            // 2. Detect Unordered List (e.g., * Item or - Item)
            const ulMatch = trimmedLine.match(/^(\*|-)\s*(.*)/);
            if (ulMatch) {
                if (listOpen !== 'ul') {
                    closeList();
                    listOpen = 'ul';
                    formatted.push("<ul class='list-disc pl-8 space-y-2 mb-4'>");
                }
                formatted.push(`<li>${ulMatch[2].trim()}</li>`);
                return;
            }

            // 3. Detect Numbered List (e.g., 1. Item)
            const olMatch = trimmedLine.match(/^\d+\.\s*(.*)/); 
            if (olMatch) {
                if (listOpen !== 'ol') {
                    closeList();
                    listOpen = 'ol';
                    formatted.push("<ol class='list-decimal pl-8 space-y-2 mb-4'>");
                }
                formatted.push(`<li>${olMatch[1].trim()}</li>`);
                return;
            }

            // 4. Default to Paragraph
            closeList();
            formatted.push(`<p class="mt-3 mb-3 text-lg leading-relaxed text-gray-700">${trimmedLine}</p>`);
        });

        closeList(); // Close any list remaining at the end

        return formatted.join("");
    };

    if (loading) return <p className="text-center mt-10 text-xl font-semibold text-indigo-600">Loading blog...</p>;
    
    if (!blog && !loading && slug) return <p className="text-center mt-10 text-xl font-semibold text-red-500">Blog not found.</p>;
    
    if (!blog) return <p className="text-center mt-10 text-xl font-semibold text-red-500">Invalid blog reference.</p>;


    return (
        <div className="bg-white min-h-screen">
            <div 
                className="h-[50vh] flex items-center justify-center bg-cover bg-center rounded-b-xl shadow-lg"
                style={{ 
                    backgroundImage: `url(${blog.image || '../src/assets/img/hero.jpg'})`,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backgroundBlendMode: 'multiply'
                }}
            >
                <div className="max-w-5xl px-5 text-center">
                    <h1 className="text-white font-extrabold text-3xl lg:text-4xl ">
                        {blog.title}
                    </h1>
                    <span className="text-indigo-200 mt-4 text-lg">
                         Published: {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-5 py-16">
                
                <div className="flex items-center justify-between mb-10 border-b pb-4">
                    <span className="px-5 py-2 text-sm bg-indigo-500 text-white font-bold rounded-full shadow-lg hover:bg-indigo-600 transition duration-300">
                        Category: {blog.category ? blog.category.name || blog.category : "Uncategorized"}
                    </span>
                    <span className="text-black-500 text-sm">
                         Published By : Admin
                    </span>
                </div>

                <div
                    // The main content block using the enhanced formatter
                    className="prose max-w-none text-black-700 font-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                />

                
            </div>
        </div>
    );
}
