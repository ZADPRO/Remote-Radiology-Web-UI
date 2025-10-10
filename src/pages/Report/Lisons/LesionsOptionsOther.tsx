import { Button } from '@/components/ui/button';
import { Checkbox2 } from '@/components/ui/CustomComponents/checkbox2';
import ClockPositionInput from '@/components/ui/CustomComponents/ClockPositionInput';
import GridNumber200 from '@/components/ui/CustomComponents/GridNumber200';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import React from 'react';
import { ReportQuestion } from '../Report';


interface Props {
    reportFormData: ReportQuestion[];
    handleReportInputChange: (questionId: number, value: string) => void;
    LabelVal: string;
    mainQId: number;
    DataQId: number;
}

const LesionsOptionsOther: React.FC<Props> = ({
    reportFormData,
    handleReportInputChange,
    LabelVal,
    mainQId,
    DataQId
}) => {

    const getAnswer = (id: number) =>
        reportFormData.find((q) => q.questionId === id)?.answer || "";

    return (
        <>
            <div>
                <div className="lg:px-10 space-y-4">
                    <div className="flex h-[auto] lg:h-[40px] gap-4 items-center">
                        <div>
                            <Checkbox2
                                checked={getAnswer(mainQId) === "Present"}
                                onCheckedChange={(checked) =>
                                    handleReportInputChange(
                                        mainQId,
                                        checked ? "Present" : ""
                                    )
                                }
                            />
                        </div>
                        <Label className="font-bold text-base flex flex-wrap lg:items-center">
                            {LabelVal}
                        </Label>
                        {
                            getAnswer(mainQId) == "Present" && (
                                <Button
                                    className="bg-[#a4b2a1] hover:bg-[#a4b2a1]"
                                    onClick={() => {
                                        let data: {
                                            name: string;
                                            locationclock: string;
                                            locationclockposition: string,
                                            locationLevel: string,
                                            locationLevelPercentage: string,
                                            distancenipple: string,
                                            size: string,
                                            Shape: string,
                                            Margins: string,
                                            density: string,
                                            Transmissionspped: string,
                                            debris: string,
                                            shadowing: string,
                                        }[] = [];

                                        try {
                                            const existing = getAnswer(DataQId);
                                            data = existing ? JSON.parse(existing) : [];
                                        } catch (err) {
                                            console.error("Invalid JSON:", err);
                                            data = [];
                                        }

                                        const updated = [
                                            ...data,
                                            {
                                                name: "",
                                                locationclock: "",
                                                locationclockposition: "",
                                                locationLevel: "",
                                                locationLevelPercentage: "",
                                                distancenipple: "",
                                                size: "",
                                                Shape: "",
                                                Margins: "",
                                                density: "",
                                                Transmissionspped: "",
                                                debris: "",
                                                shadowing: "",
                                            }
                                        ];
                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                    }}
                                >
                                    Add
                                </Button>
                            )
                        }
                    </div>

                    {
                        getAnswer(mainQId) == "Present" && (
                            <>
                                {(() => {
                                    let dataArray: any[] = [];
                                    try {
                                        const raw = getAnswer(DataQId);
                                        dataArray = raw ? JSON.parse(raw) : [];
                                    } catch (err) {
                                        console.error("Invalid JSON:", err);
                                    }

                                    return dataArray.map((data, index) => (
                                        <div key={index}>
                                            <div className="flex gap-3">
                                                <div className="ml-[1rem] flex justify-center items-center w-[5%]">{index + 1}.</div>

                                                <div className="w-[85%] flex flex-col space-y-0 mb-5">
                                                    {/* Name */}
                                                    <div>
                                                        <div className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}>
                                                            <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                                                                <span>
                                                                    Specify
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="w-40"
                                                                placeholder="Specify"
                                                                value={data.name}
                                                                onChange={(e) => {
                                                                    const updated = [...dataArray];
                                                                    updated[index].name = e.target.value;
                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Location - Clock Position */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Location - Clock Position
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Centrally located", value: "Centrally located" },
                                                                    { label: "Subareolar", value: "Subareolar" },
                                                                    { label: "Clock Position", value: "Clock Position" }
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`clock-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`positionquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.locationclock === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].locationclock = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                        {
                                                            data.locationclock == "Clock Position" && (
                                                                <div className="ml-[2rem] lg:ml-[30rem]">
                                                                    <ClockPositionInput
                                                                        value={data.locationclockposition}
                                                                        onChange={(e) => {
                                                                            const updated = [...dataArray];
                                                                            updated[index].locationclockposition = e;
                                                                            handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    {/* Location - Level */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Location - Level
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Coronal Level", value: "Coronal Level" },
                                                                    { label: "Axial", value: "Axial" },
                                                                    { label: "Sagital", value: "Sagital" }
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Level-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`levelquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.locationLevel === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].locationLevel = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>

                                                        {
                                                            data.locationLevel === "Sagital" && (
                                                                <div className="ml-[2rem] lg:ml-[26.5rem]">
                                                                    <div className="w-full flex items-center gap-2">
                                                                        <div>M - </div>
                                                                        <div>
                                                                            <GridNumber200
                                                                                value={data.locationLevelPercentage}
                                                                                onChange={(e) => {
                                                                                    const updated = [...dataArray];
                                                                                    updated[index].locationLevelPercentage = e;
                                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            data.locationLevel === "Axial" && (
                                                                <div className="ml-[2rem] lg:ml-[22rem]">
                                                                    <div className="w-full flex items-center gap-2">
                                                                        <div>S - </div>
                                                                        <div>
                                                                            <GridNumber200
                                                                                value={data.locationLevelPercentage}
                                                                                onChange={(e) => {
                                                                                    const updated = [...dataArray];
                                                                                    updated[index].locationLevelPercentage = e;
                                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }

                                                        {
                                                            data.locationLevel === "Coronal Level" && (
                                                                <div className="ml-[2rem] lg:ml-[14rem]">
                                                                    <div className="w-full flex items-center gap-2">
                                                                        <div>P - </div>
                                                                        <div>
                                                                            <GridNumber200
                                                                                value={data.locationLevelPercentage}
                                                                                onChange={(e) => {
                                                                                    const updated = [...dataArray];
                                                                                    updated[index].locationLevelPercentage = e;
                                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    {/* Distance from Nipple */}
                                                    <div>
                                                        <div className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}>
                                                            <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                                                                <span>
                                                                    Distance from Nipple
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                className="w-20"
                                                                placeholder="cm"
                                                                value={data.distancenipple}
                                                                onChange={(e) => {
                                                                    const updated = [...dataArray];
                                                                    updated[index].distancenipple = e.target.value;
                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                }}
                                                            />
                                                            <div className="flex items-center ml-[1rem]">
                                                                cm
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Size */}
                                                    <div>
                                                        <div className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}>
                                                            <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                                                                <span>
                                                                    Size
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                className="w-20"
                                                                placeholder="mm"
                                                                value={data.size}
                                                                onChange={(e) => {
                                                                    const updated = [...dataArray];
                                                                    updated[index].size = e.target.value;
                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                }}
                                                            />
                                                            <div className="flex items-center ml-[1rem]">
                                                                mm
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Shape */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Shape
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Round", value: "Round" },
                                                                    { label: "Oval", value: "Oval" },
                                                                    { label: "Irregular", value: "Irregular" }
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Shape-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`shapequestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.Shape === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].Shape = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Margins */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Margins
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Circumscribed", value: "Circumscribed" },
                                                                    { label: "Microlobulated", value: "Microlobulated" },
                                                                    { label: "Indistinct", value: "Indistinct" },
                                                                    { label: "Obscured", value: "Obscured" },
                                                                    { label: "Spiculated", value: "Spiculated" },
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Margins-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`marginsquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.Margins === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].Margins = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Density/Echogenicity */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Density/Echogenicity
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Hypoechoic", value: "Hypoechoic" },
                                                                    { label: "Isoechoic", value: "Isoechoic" },
                                                                    { label: "Hyperechoic", value: "Hyperechoic" },
                                                                    { label: "Complex", value: "Complex" },
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Density-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`densityquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.density === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].density = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>

                                                    {/* Transmission Speed */}
                                                    <div>
                                                        <div className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}>
                                                            <Label className="font-semibold text-base w-full lg:w-50 flex flex-wrap lg:items-center">
                                                                <span>
                                                                    Transmission Speed
                                                                </span>
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                className="w-20"
                                                                placeholder="m/s"
                                                                value={data.Transmissionspped}
                                                                onChange={(e) => {
                                                                    const updated = [...dataArray];
                                                                    updated[index].Transmissionspped = e.target.value;
                                                                    handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                }}
                                                            />
                                                            <div className="flex items-center ml-[1rem]">
                                                                (m/s)
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Internal debris */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Internal debris
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Present", value: "present" },
                                                                    { label: "Not present", value: "not present" },
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Internal-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`internalquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.debris === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].debris = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>


                                                    {/* shadowing */}
                                                    <div>
                                                        <div
                                                            className={"flex flex-wrap gap-4 h-auto items-start lg:items-center"}
                                                        >
                                                            <Label className="font-semibold w-auto lg:w-50 text-base flex flex-wrap lg:items-center">
                                                                Shadowing
                                                            </Label>
                                                            {
                                                                [
                                                                    { label: "Present", value: "present" },
                                                                    { label: "Not present", value: "not present" },
                                                                ].map((item, indexVal) => (
                                                                    <>
                                                                        <div
                                                                            className="flex flex-wrap gap-4 h-auto items-start lg:items-center"
                                                                        >
                                                                            <div key={item.value} className="flex h-auto  items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    id={`Shadowing-${mainQId}-${index}-${indexVal}`}
                                                                                    name={`shadowingquestion-${mainQId}-${index}`}
                                                                                    value={item.value}
                                                                                    checked={data.shadowing === item.value}
                                                                                    onChange={() => {
                                                                                        const updated = [...dataArray];
                                                                                        updated[index].shadowing = item.value;
                                                                                        console.log(updated)
                                                                                        handleReportInputChange(DataQId, JSON.stringify(updated));
                                                                                    }
                                                                                    }
                                                                                    required={true}
                                                                                    className="custom-radio"
                                                                                />
                                                                                <Label htmlFor={indexVal.toString()}>{item.label}</Label>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-[10%] flex justify-center items-center">
                                                    <Trash
                                                        className="text-[red] w-5 h-5 cursor-pointer"
                                                        onClick={() => {
                                                            const updated = dataArray.filter((_, i) => i !== index);
                                                            handleReportInputChange(DataQId, JSON.stringify(updated));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    ));
                                })()}
                            </>
                        )
                    }


                </div>
            </div>
        </>
    );
};

export default LesionsOptionsOther;