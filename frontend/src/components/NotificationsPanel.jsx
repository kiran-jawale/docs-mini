import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDom } from "../contexts/DomContext";
import noticeService from "../services/notice.service";

const NotificationsPanel = () => {
  const { isNotificationsVisible, toggleNotifications } = useDom();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNotificationsVisible) {
      fetchNotices();
    }
  }, [isNotificationsVisible]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeService.getNotices();
      setNotices(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isNotificationsVisible && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 z-[50] w-full md:w-[400px] h-full bg-white dark:bg-zinc-900 shadow-2xl border-l border-gray-200 dark:border-zinc-800 flex flex-col"
        >
          <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <span>📢</span> Noticeboard
            </h2>
            <button
              onClick={toggleNotifications}
              className="text-2xl text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading notices...</p>
            ) : notices.length === 0 ? (
              <p className="text-center text-gray-500">No new notices.</p>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice._id}
                  className={`p-4 rounded-xl border-l-4  bg-blue-50 dark:bg-blue-900/10 ${notice.type === "alert" ? "border-red-500" : notice.type === "success" ? "border-green-500" : notice.type === "info" ? "border-blue-500" : "border-gray-300"}`}
                >
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">
                    {notice.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {notice.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase">
                    {new Date(notice.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
