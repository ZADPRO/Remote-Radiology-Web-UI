import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  EditImpressionRecommendationFormData,
  GetAllCategoryData,
  ImpressionRecommendationFormData,
  impressionrecommendationService,
  ImpressionRecommendationValModel,
} from "../../../services/impressionRecommendationService";
import { ArrowDownUp, GripVertical, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// DND kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

type Props = {
  categoryData: GetAllCategoryData[];
  ImpressionRecommendationData: ImpressionRecommendationValModel[];
  GetImpressionRecommendation: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const NASystem: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [impressionrecommendation, setImpressionrecommendation] =
    useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [rows, setRows] = useState<ImpressionRecommendationValModel[]>(
    props.ImpressionRecommendationData
  );
  const [formData, setFormData] = useState<ImpressionRecommendationFormData>({
    categoryId: "",
    systemType: "NA",
    impressionRecommendationId: "",
    impressionTextColor: "#000000",
    recommedationTextColor: "#000000",
    impressionShortDescription: "",
    recommendationShortDescription: "",
    impressionLongDescription: "",
    recommendationLongDescription: "",
  });
  const [EditformData, setEditFormData] =
    useState<EditImpressionRecommendationFormData>({
      id: 0,
      categoryId: 0,
      systemType: "NA",
      impressionRecommendationId: "",
      impressionTextColor: "#000000",
      recommedationTextColor: "#000000",
      impressionShortDescription: "",
      recommendationShortDescription: "",
      impressionLongDescription: "",
      recommendationLongDescription: "",
    });
  const [editImpressionRecommendation, setEditImpressionRecommendation] =
    useState(false);
  const [deleteImpressionRecommendation, setDeleteImpressionRecommendation] =
    useState(false);

  useEffect(() => {
    setRows(props.ImpressionRecommendationData);
  }, [props.ImpressionRecommendationData]);

  const AddImpressionRecommendation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (loading) return;
    if (formData.categoryId.length === 0) {
      toast.error("Please select category");
      return;
    }
    try {
      setLoading(true);
      const res =
        await impressionrecommendationService.AddImpressionRecommendation(
          formData
        );
      if (res.status) {
        setFormData({
          categoryId: "",
          systemType: "NA",
          impressionRecommendationId: "",
          impressionTextColor: "#000000",
          recommedationTextColor: "#000000",
          impressionShortDescription: "",
          recommendationShortDescription: "",
          impressionLongDescription: "",
          recommendationLongDescription: "",
        });
        setImpressionrecommendation(false);
        toast.success(res.message);
        props.GetImpressionRecommendation();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const UpdateImpressionRecommendation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (loading) return;
    if (EditformData.categoryId === 0) {
      toast.error("Please select category");
      return;
    }
    try {
      setLoading(true);
      const res =
        await impressionrecommendationService.UpdateImpressionRecommendation(
          EditformData
        );
      if (res.status) {
        setEditFormData({
          id: 0,
          categoryId: 0,
          systemType: "NA",
          impressionRecommendationId: "",
          impressionTextColor: "#000000",
          recommedationTextColor: "#000000",
          impressionShortDescription: "",
          recommendationShortDescription: "",
          impressionLongDescription: "",
          recommendationLongDescription: "",
        });
        setEditImpressionRecommendation(false);
        toast.success(res.message);
        props.GetImpressionRecommendation();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const DeleteImpressionRecommendation = async () => {
    try {
      setDeleteImpressionRecommendation(false);
      setLoading(true);
      const res =
        await impressionrecommendationService.DeleteImpressionRecommendation(
          EditformData
        );
      if (res.status) {
        setEditFormData({
          id: 0,
          categoryId: 0,
          systemType: "NA",
          impressionRecommendationId: "",
          impressionTextColor: "#000000",
          recommedationTextColor: "#000000",
          impressionShortDescription: "",
          recommendationShortDescription: "",
          impressionLongDescription: "",
          recommendationLongDescription: "",
        });
        toast.success(res.message);
        props.GetImpressionRecommendation();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // DND setup
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((item) => item.refIRVId === active.id);
    const newIndex = rows.findIndex((item) => item.refIRVId === over.id);
    const updated = arrayMove(rows, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      refIRVOrderId: idx + 1,
    }));
    setRows(updated);
  };

  const saveOrder = async () => {
    try {
      setSavingOrder(true);
      const payload = rows.map((item) => ({
        id: item.refIRVId,
        orderId: item.refIRVOrderId,
      }));
      const res = await impressionrecommendationService.UpdateOrder(payload);
      if (res.status) {
        toast.success("Order updated successfully!");
        props.GetImpressionRecommendation();
      } else {
        toast.error(res.message || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving order!");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* New Dialog form */}
      <Dialog
        open={impressionrecommendation}
        onOpenChange={setImpressionrecommendation}
      >
        <DialogContent className="w-[80%] h-[auto] max-h-[90vh] overflow-auto">
          <form onSubmit={AddImpressionRecommendation}>
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-normal">
                New Impression and Recommendation
              </h1>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="categoryId">
                      Category Type
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger
                        id="categoryId"
                        className="bg-white w-full"
                      >
                        <SelectValue placeholder="Choose Category Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {props.categoryData.map((data) => (
                          <SelectItem value={data.refIRCId.toString()}>
                            <div className="w-40 flex justify-start">
                              {data.refIRCName}
                            </div>{" "}
                            <div
                              className={`w-3.5 h-3.5 rounded border-1`}
                              style={{ backgroundColor: data.refIRCColor }}
                            ></div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression and Recommendation ID
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter Impression and Recommendation ID (Eg: 1a or 2a Or ...)"
                      className="bg-white"
                      value={formData.impressionRecommendationId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          impressionRecommendationId: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Text Color
                    </Label>
                    <div className="flex gap-5">
                      <Input
                        type="text"
                        placeholder="Enter Color Code (Eg: #000000  or ...)"
                        className="bg-white w-[90%]"
                        value={formData.impressionTextColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            impressionTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                      <Input
                        type="color"
                        className="bg-white w-[10%]"
                        value={formData.impressionTextColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            impressionTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Text Color
                    </Label>
                    <div className="flex gap-5">
                      <Input
                        type="text"
                        placeholder="Enter Color Code (Eg: #000000  or ...)"
                        className="bg-white w-[90%]"
                        value={formData.recommedationTextColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            recommedationTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                      <Input
                        type="color"
                        className="bg-white w-[10%]"
                        value={formData.recommedationTextColor}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            recommedationTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Short Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={formData.impressionShortDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          impressionShortDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Impression Short Description"
                      className="w-full text-xs sm:text-sm min-h-[40px] sm:min-h-[60px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Short Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={formData.recommendationShortDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recommendationShortDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Recommendation Short Description"
                      className="w-full text-xs sm:text-sm min-h-[40px] sm:min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Long Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={formData.impressionLongDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          impressionLongDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Impression Long Description"
                      className="w-full text-xs sm:text-sm min-h-[50px] sm:min-h-[70px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Long Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={formData.recommendationLongDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recommendationLongDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Recommendation Long Description"
                      className="w-full text-xs sm:text-sm min-h-[50px] sm:min-h-[70px] resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-10 mt-8">
                <Button
                  type="submit"
                  className="w-80 text-[#fff]"
                  variant="greenTheme"
                >
                  {loading ? <Loader2 className="animate-spin" /> : `Save`}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog Form */}
      <Dialog
        open={editImpressionRecommendation}
        onOpenChange={setEditImpressionRecommendation}
      >
        <DialogContent className="w-[80%] h-[auto] max-h-[90vh] overflow-auto">
          <form onSubmit={UpdateImpressionRecommendation}>
            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-normal">
                Update Impression and Recommendation
              </h1>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="categoryId">
                      Category Type
                    </Label>
                    <Select
                      value={EditformData.categoryId.toString()}
                      onValueChange={(value) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          categoryId: parseInt(value),
                        }))
                      }
                      required
                    >
                      <SelectTrigger
                        id="categoryId"
                        className="bg-white w-full"
                      >
                        <SelectValue placeholder="Choose Category Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {props.categoryData.map((data) => (
                          <SelectItem value={data.refIRCId.toString()}>
                            <div className="w-40 flex justify-start">
                              {data.refIRCName}
                            </div>{" "}
                            <div
                              className={`w-3.5 h-3.5 rounded border-1`}
                              style={{ backgroundColor: data.refIRCColor }}
                            ></div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression and Recommendation ID
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter Impression and Recommendation ID (Eg: 1a or 2a Or ...)"
                      className="bg-white"
                      value={EditformData.impressionRecommendationId}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          impressionRecommendationId: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Text Color
                    </Label>
                    <div className="flex gap-5">
                      <Input
                        type="text"
                        placeholder="Enter Color Code (Eg: #000000  or ...)"
                        className="bg-white w-[90%]"
                        value={EditformData.impressionTextColor}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            impressionTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                      <Input
                        type="color"
                        className="bg-white w-[10%]"
                        value={EditformData.impressionTextColor}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            impressionTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Text Color
                    </Label>
                    <div className="flex gap-5">
                      <Input
                        type="text"
                        placeholder="Enter Color Code (Eg: #000000  or ...)"
                        className="bg-white w-[90%]"
                        value={EditformData.recommedationTextColor}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            recommedationTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                      <Input
                        type="color"
                        className="bg-white w-[10%]"
                        value={EditformData.recommedationTextColor}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            recommedationTextColor: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Short Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={EditformData.impressionShortDescription}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          impressionShortDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Impression Short Description"
                      className="w-full text-xs sm:text-sm min-h-[40px] sm:min-h-[60px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Short Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={EditformData.recommendationShortDescription}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          recommendationShortDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Recommendation Short Description"
                      className="w-full text-xs sm:text-sm min-h-[40px] sm:min-h-[60px] resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-x-10 gap-y-3">
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Impression Long Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={EditformData.impressionLongDescription}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          impressionLongDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Impression Long Description"
                      className="w-full text-xs sm:text-sm min-h-[50px] sm:min-h-[70px] resize-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 2xl:gap-6 w-full lg:w-1/2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm " htmlFor="email">
                      Recommendation Long Description
                    </Label>
                    <Textarea
                      name="fromAddress"
                      value={EditformData.recommendationLongDescription}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          recommendationLongDescription: e.target.value,
                        }))
                      }
                      required
                      placeholder="Enter Recommendation Long Description"
                      className="w-full text-xs sm:text-sm min-h-[50px] sm:min-h-[70px] resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-10 mt-8">
                <Button
                  type="submit"
                  className="w-80 text-[#fff]"
                  variant="greenTheme"
                >
                  {loading ? <Loader2 className="animate-spin" /> : `Save`}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog Form */}
      <Dialog
        open={deleteImpressionRecommendation}
        onOpenChange={setDeleteImpressionRecommendation}
      >
        <DialogContent className="w-85 h-auto overflow-y-auto p-5">
          <DialogHeader>
            <h1 className="font-semibold text-normal">
              Delete Impression and Recommendation ID (
              {EditformData.impressionRecommendationId})
            </h1>
            <div className="grid gap-4 mt-4">
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    setDeleteImpressionRecommendation(false);
                  }}
                  variant="outline"
                  className="w-35"
                >
                  Cancel
                </Button>
                <Button
                  className="w-35"
                  variant="greenTheme"
                  onClick={() => {
                    DeleteImpressionRecommendation();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between">
        {/* Add button */}
        <Button
          onClick={() => setImpressionrecommendation(true)}
          variant="greenTheme"
          className="text-sm w-80 px-3 py-1 text-[#fff] mb-4"
        >
          Add Impression & Recommendation
        </Button>

        {/* Save order button */}
        {rows.length > 0 && (
          <div className="flex justify-end mb-3">
            <Button
              onClick={saveOrder}
              disabled={savingOrder}
              variant="greenTheme"
              className="text-sm w-40 text-[#fff]"
            >
              {savingOrder ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Order"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Table with drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={rows.map((r) => r.refIRVId)}
          strategy={verticalListSortingStrategy}
        >
          <Table className="border rounded-lg">
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-[#81927f] rounded-t-lg">
                <TableHead className="font-bold">
                  <ArrowDownUp size={16} />
                </TableHead>
                {/* <TableHead className="font-bold">Order ID</TableHead> */}
                <TableHead className="font-bold">
                  Impression and Recommendation ID
                </TableHead>
                <TableHead className="font-bold">Category Type</TableHead>
                <TableHead className="font-bold">Edit</TableHead>
                <TableHead className="font-bold">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((row) => (
                  <SortableRow key={row.refIRVId} id={row.refIRVId}>
                    {/* <TableCell>{row.refIRVOrderId}</TableCell> */}
                    <TableCell>{row.refIRVCustId}</TableCell>
                    <TableCell className="flex">
                      <div className="w-40 flex justify-start">
                        {row.refIRCName}
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded border`}
                        style={{ backgroundColor: row.refIRCColor }}
                      ></div>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="greenTheme"
                        onClick={() => {
                          setEditImpressionRecommendation(true);
                          setEditFormData({
                            id: row.refIRVId,
                            categoryId: row.refIRCId,
                            systemType: "NA",
                            impressionRecommendationId: row.refIRVCustId,
                            impressionTextColor: row.refIRVImpressionTextColor,
                            recommedationTextColor:
                              row.refIRVRecommendationTextColor,
                            impressionShortDescription:
                              row.refIRVImpressionShortDesc,
                            recommendationShortDescription:
                              row.refIRVRecommendationShortDesc,
                            impressionLongDescription:
                              row.refIRVImpressionLongDesc,
                            recommendationLongDescription:
                              row.refIRVRecommendationLongDesc,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="greenTheme"
                        onClick={() => {
                          setDeleteImpressionRecommendation(true);
                          setEditFormData({
                            id: row.refIRVId,
                            categoryId: row.refIRCId,
                            systemType: "NA",
                            impressionRecommendationId: row.refIRVCustId,
                            impressionTextColor: row.refIRVImpressionTextColor,
                            recommedationTextColor:
                              row.refIRVRecommendationTextColor,
                            impressionShortDescription:
                              row.refIRVImpressionShortDesc,
                            recommendationShortDescription:
                              row.refIRVRecommendationShortDesc,
                            impressionLongDescription:
                              row.refIRVImpressionLongDesc,
                            recommendationLongDescription:
                              row.refIRVRecommendationLongDesc,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </SortableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    No Impression and Recommendation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

// SortableRow component
const SortableRow = ({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {/* 👇 Only this small handle is draggable */}
      <TableCell {...attributes} {...listeners} className=" w-8 text-center">
        <GripVertical
          className="cursor-grab active:cursor-grabbing"
          size={16}
        />
      </TableCell>
      {children}

      {/* 👇 All other cells behave normally */}
    </TableRow>
  );
};

export default NASystem;
