import Accordion from "@/components/playground/Accordion";

export default function PlaygroundPage() {
    return (
        <div>
            <h2>Accordion demo</h2>
            <Accordion title="Title 1">
                Some info 1
            </Accordion>
            <Accordion title="Title 2">
                Some info 2
            </Accordion>
            <Accordion title="Title 3">
                Some info 3
            </Accordion>
        </div>
    )
}