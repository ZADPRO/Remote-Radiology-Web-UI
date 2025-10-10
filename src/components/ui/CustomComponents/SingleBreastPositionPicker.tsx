import React, { useState } from 'react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
 
type Props = {
    value: string; // comma-separated string of numbers
    onChange: (value: string) => void;
    singleSelect?: boolean; // 👈 new prop
    nippleStatus?: boolean;
};
 
const formatLabel = (input: string, nippleStatus: boolean): string => {
    const cleaned = input
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '' && !isNaN(Number(item)))
        .map(Number);
 
    if (cleaned.length === 0) return '';

    if(nippleStatus){
        return cleaned
            .map((num) => (num === 0 ? 'Nipple' : `${num}'o Clock`))
            .join(', ');
    }else{
         return cleaned
            .map((num) => (num === 0 ? 'Retroareolar region' : `${num}'o Clock`))
            .join(', ');
    }
 
};
const SingleBreastPositionPicker: React.FC<Props> = ({
    value,
    onChange,
    singleSelect = false,
    nippleStatus = true,
}) => {
    const [open, setOpen] = useState(false);
    const parsedValues: number[] = value
        ? value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item !== '' && !isNaN(Number(item)))
            .map(Number)
        : [];
 
    const toggleValue = (val: number) => {
        let updated: number[] = [];
 
        if (singleSelect) {
            updated = [val]; // ✅ only one value allowed
        } else {
            const exists = parsedValues.includes(val);
            updated = exists
                ? parsedValues.filter((v) => v !== val)
                : [...parsedValues, val];
        }
 
        updated = [...new Set(updated)].sort((a, b) => a - b);
        onChange(updated.join(','));
 
        if (singleSelect) {
            setOpen(false); // auto-close if single-select
        }
    };
 
    const cx = 100;
    const cy = 100;
    const r = 90;
    const total = 12;
 
    const slices = Array.from({ length: total }, (_, i) => {
        const idx = i + 1;
        const startAngle = (i / total) * 2 * Math.PI;
        const endAngle = ((i + 1) / total) * 2 * Math.PI;
 
        const x1 = cx + r * Math.sin(startAngle);
        const y1 = cy - r * Math.cos(startAngle);
        const x2 = cx + r * Math.sin(endAngle);
        const y2 = cy - r * Math.cos(endAngle);
 
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
 
        return (
            <path
                key={`s-${idx}`}
                d={d}
                className={`cursor-pointer transition-all duration-200 stroke-black stroke-[1px] ${parsedValues.includes(idx) ? 'fill-[#edd1ce]' : 'fill-white'
                    }`}
                onClick={() => toggleValue(idx)}
            />
        );
    });
 
    const labels = Array.from({ length: total }, (_, i) => {
        const angle = ((i + 0.5) / total) * 2 * Math.PI;
        const x = cx + (r - 20) * Math.sin(angle);
        const y = cy - (r - 20) * Math.cos(angle);
        return (
            <text
                key={`label-${i + 1}`}
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="text-[12px] fill-black font-bold pointer-events-none"
            >
                {i + 1}
            </text>
        );
    });
 
    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`text-sm ${nippleStatus ? `w-18` : `w-38`} px-3 py-1`}
                        onClick={() => setOpen(true)}
                    >
                        {value ? formatLabel(value, nippleStatus) : 'Select'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[230px] h-[230px] bg-white z-50 rounded-full border flex justify-center items-center relative"
                    side="bottom"
                    align="center"
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {slices}
                        {labels}
                        <circle
                            cx={cx}
                            cy={cy}
                            r="20"
                            className={`stroke-black stroke-[0.5] cursor-pointer transition-all duration-200 ${parsedValues.includes(0) ? 'fill-[#ff9b99]' : 'fill-[#fce2da]'
                                }`}
                            onClick={() => toggleValue(0)}
                        />
                    </svg>
                </PopoverContent>
            </Popover>
        </div>
    );
};
 
export default SingleBreastPositionPicker;