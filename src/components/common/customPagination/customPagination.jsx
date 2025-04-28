import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
// import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function CustomPagination({ handleNext, handlePrev, totalPages }) {
    const [active, setActive] = React.useState(1);

    const getItemProps = (index) => ({
        variant: active === index ? "filled" : "text",
        color: "gray",
        onClick: () => setActive(index),
    });

    const next = () => {
        if (active === totalPages) return;

        setActive(active + 1);
    };

    const prev = () => {
        if (active === 1) return;

        setActive(active - 1);
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={prev}
                disabled={active === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                Previous
            </Button>

            <div
                className="flex items-center gap-2 overflow-x-auto scroll-smooth"
                style={{ maxWidth: "calc(100% - 120px)" }} // Adjust width for scroll
            >
                {[...Array(totalPages)].map((_, index) => (
                    <IconButton {...getItemProps(index + 1)} key={index}>
                        {index + 1}
                    </IconButton>
                ))}
            </div>

            <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={next}
                disabled={active === totalPages}
            >
                Next
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}
