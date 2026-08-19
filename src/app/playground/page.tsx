"use client";

import { useState } from "react";
import Accordion from "@/components/playground/Accordion";
import Tabs from "@/components/playground/Tabs";
import Modal from "@/components/playground/Modal";

export default function PlaygroundPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const myTabs = [
        { id: "music", label: "My Music", content: "Your saved tracks and playlists will appear here." },
        { id: "community", label: "Community", content: "See what other users are currently listening to." },
        { id: "settings", label: "Settings", content: "Manage your account preferences and notifications." }
    ];

    return (
        <div className="p-8 max-w-2xl mx-auto flex flex-col gap-12">
            
            <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Accordion Demo</h2>
                <div className="flex flex-col gap-2">
                    <Accordion title="Title 1">Some info 1</Accordion>
                    <Accordion title="Title 2">Some info 2</Accordion>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Tabs Demo</h2>
                <Tabs items={myTabs} ariaLabel="User Dashboard Sections" />
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4 text-white">Modal Demo</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:ring-green-500"
                >
                    Open Settings Modal
                </button>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    title="Account Settings"
                >
                    <div className="flex flex-col gap-4">
                        <p>Are you sure you want to delete your playlist? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-neutral-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                Delete Playlist
                            </button>
                        </div>
                    </div>
                </Modal>
            </section>

        </div>
    );
}