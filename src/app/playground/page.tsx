import Accordion from "@/components/playground/Accordion";
import Tabs from "@/components/playground/Tabs";

export default function PlaygroundPage() {
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
        </div>
    );
}