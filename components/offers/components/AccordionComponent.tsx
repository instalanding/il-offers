import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionComponent: React.FC<{ value: { id: number; title: string; content: string; }[]; style?: React.CSSProperties }> = ({ value, style }) => {
    return (
        <div style={style}>

            <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
                {value.map((item) => (
                    <AccordionItem key={item.id} value={item.id.toString()} className="border rounded-md border-gray-200">
                        <AccordionTrigger className="text-left py-4 px-2 text-sm font-semibold text-gray-800 hover:text-gray-600 transition-all">{item.title}</AccordionTrigger>
                        <AccordionContent className="py-2 px-4 text-sm text-gray-600 text-editor-css">
                            <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default AccordionComponent; 
