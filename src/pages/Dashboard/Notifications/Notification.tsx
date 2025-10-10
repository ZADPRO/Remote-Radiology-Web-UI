import React, { useEffect, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListAllNotification, notificationService } from "@/services/notificationService";
import LoadingOverlay from "@/components/ui/CustomComponents/loadingOverlay";

// interface Notification {
//   id: number;
//   message: string;
//   time: string;
//   read: boolean;
// }

// Mock data
// const mockNotifications: ListAllNotification[] = Array.from({ length: 123 }, (_, i) => ({
//   refNId: i + 1,
//   refNMessage: `This is the message content of notification ${i + 1}.`,
//   refNCreatedAt: "2025-05-02",
//   refNReadStatus: i % 3 === 0 ? true : false,
// }));

const ITEMS_PER_PAGE = 10;

const NotificationDialog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<ListAllNotification[]>();
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  // const totalPages = notifications?.length
  //   ? Math.ceil(notifications.length / ITEMS_PER_PAGE)
  //   : 0;

  // const toggleReadStatus = async(id: number) => {
  //   await updateReadStatus(id, !notifications?.find((notif) => notif.refNId === id)?.refNReadStatus);
  //   setNotifications((prev) =>
  //     prev?.map((notif) =>
  //       notif.refNId === id ? { ...notif, refNReadStatus: !notif.refNReadStatus } : notif
  //     )
  //   );
  // };

  const getAllNotification = async(page: number) => {
    setLoading(true);
    try {
      const res = await notificationService.getAllNotification(page*10);
      console.log(res);

      if(res.status) {
        setNotifications(res.data);
        setTotalPages(Math.ceil(res.totalcount / ITEMS_PER_PAGE))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const updateReadStatus = async (id: number) => {
    setLoading(true);
    try {
      const res = await notificationService.notifiReadStatus(id, !notifications?.find((notif) => notif.refNId === id)?.refNReadStatus);
      console.log(res);

      if(res.status) {
        getAllNotification(page);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
      

  useEffect(() => {
    getAllNotification(page);
  }, [page]);

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
//   };

  // 🔹 Pagination generator with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let last: number | null = null;
    for (let i of range) {
      if (last !== null) {
        if ((i as number) - last === 2) {
          rangeWithDots.push(last + 1);
        } else if ((i as number) - last > 2) {
          rangeWithDots.push("…");
        }
      }
      rangeWithDots.push(i);
      last = i as number;
    }

    return rangeWithDots;
  };

  return (
    <DialogContent className="max-w-3xl">
      {loading && <LoadingOverlay />}
      {/* Header */}
      <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
        <DialogTitle className="text-lg font-semibold">
          Notifications{" "}
          <span className="text-sm text-muted-foreground">
            ({notifications?.filter((n) => !n.refNReadStatus).length} unread)
          </span>
        </DialogTitle>
        {/* <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button> */}
      </DialogHeader>

      {/* Notification List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto mt-3 pr-1">
        {notifications?.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            🎉 You’re all caught up!
          </p>
        ) : (
          notifications?.map((notif) => (
            <Card
              key={notif.refNId}
              className={`flex items-start justify-between rounded-lg p-3 transition ${
                notif.refNReadStatus
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white border-l-4 border-l-primary"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                {/* {!notif.read && (
                  <Circle className="h-2.5 w-2.5 text-primary fill-primary shrink-0" />
                )} */}
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <p>{notif.refNCreatedAt}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateReadStatus(notif.refNId)}
                    >
                      {notif.refNReadStatus ? "Mark Unread" : "Mark Read"}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{notif.refNMessage}</p>
                </div>
              </div>
              {/* {!notif.read && (
                <button
                  className="text-primary hover:text-primary/80 transition"
                  onClick={() => toggleReadStatus(notif.id)}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              )} */}
            </Card>
          ))
        )}
      </div>

      {/* Advanced Pagination */}
      {(
        <div className="flex justify-center items-center gap-1 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          {getPageNumbers().map((num, idx) =>
            num === "…" ? (
              <span key={idx} className="px-2 text-muted-foreground">
                …
              </span>
            ) : (
              <Button
                key={idx}
                variant={page === num ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setPage(num as number)}
              >
                {num}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </DialogContent>
  );
};

export default NotificationDialog;