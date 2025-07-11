import React, { useState } from 'react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
 
type Props = {
    value: string;
    onChange: (value: string) => void;
};
 
const ClockPositionInput: React.FC<Props> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false); // 👈 control popover state
 
    return (
        <div className="w-full flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="text-sm px-3 py-1"
                        onClick={() => setOpen(true)} // 👈 manually open
                    >
                        {value || "Select Clock Position"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-48 h-48 bg-white z-50 rounded-full border flex justify-center items-center relative"
                    side="bottom"
                    align="center"
                >
                    {Array.from({ length: 12 }).map((_, index) => {
                        const angle = (index * 30 - 90) * (Math.PI / 180);
                        const x = 70 * Math.cos(angle);
                        const y = 70 * Math.sin(angle);
                        const label = index === 0 ? 12 : index;
                        const isSelected = value === label.toString();
 
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    onChange(label.toString()); // update value
                                    setOpen(false); // 👈 close popover
                                }}
                                className={`absolute text-sm font-medium cursor-pointer transition-transform
                  ${isSelected ? "bg-[#edd1ce] text-[#000] rounded-full w-7 h-7 flex items-center justify-center" : ""}
                `}
                                style={{
                                    top: `calc(50% + ${y}px)`,
                                    left: `calc(50% + ${x}px)`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                {label}
                            </div>
                        );
                    })}
                </PopoverContent>
            </Popover>
            <div>o'clock</div>
        </div>
    );
};
 
export default ClockPositionInput;