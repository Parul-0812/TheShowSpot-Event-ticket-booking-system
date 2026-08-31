import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import "../styles/adminDashboard.css";

const API = "http://localhost:5000";

const EMPTY_EVENT = {
    name: "",
    category: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    city: "",
    address: "",
    price: "",
    totalSeats: "",
    image: "",
    organizerName: "",
    email: "",
    phone: ""
};

const NAV = [
    ["dashboard", "🏠", "Dashboard"],
    ["events", "🎫", "Events"],
    ["requests", "📩", "Event Requests"],
    ["bookings", "🎟️", "Bookings"],
    ["users", "👥", "Users"],
    ["payments", "💳", "Payments"]
];

const money = value =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);

const dateValue = value => {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
};

const formatDate = value => {
    const date = dateValue(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const formatLongDate = value => {
    const date = dateValue(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const startOfToday = () => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
};

const daysFromToday = value => {
    const date = dateValue(value);

    if (!date) return null;

    const today = startOfToday();

    const target = new Date(date);

    target.setHours(0, 0, 0, 0);

    return Math.round(
        (target.getTime() - today.getTime()) /
        86400000
    );
};

const isUpcomingWithinTwoWeeks = value => {
    const days = daysFromToday(value);

    return (
        days !== null &&
        days >= 0 &&
        days <= 14
    );
};

const isFutureEvent = value => {
    const days = daysFromToday(value);

    return days !== null && days >= 0;
};

const eventNameOf = item =>
    item?.name ||
    item?.eventName ||
    item?.title ||
    "Event";

const eventImageOf = item =>
    item?.image ||
    item?.imageUrl ||
    item?.poster ||
    item?.posterUrl ||
    "";

const eventCityOf = item =>
    item?.city ||
    item?.location ||
    item?.venue ||
    "Location not provided";

const eventPriceOf = item =>
    item?.price ??
    item?.ticketPrice ??
    0;

const getStatus = value =>
    String(value || "Unknown").trim();

const normalizeStatus = value =>
    getStatus(value)
        .toLowerCase()
        .replace(/\s+/g, "-");

const seatsOfBooking = booking => {
    if (Array.isArray(booking?.seats)) {
        return booking.seats;
    }

    if (
        typeof booking?.seats === "string" &&
        booking.seats.trim()
    ) {
        return booking.seats
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    const quantity = Number(
        booking?.quantity ||
        booking?.tickets ||
        booking?.ticketCount ||
        1
    );

    if (!Number.isFinite(quantity) || quantity <= 0) {
        return [];
    }

    return Array.from(
        { length: quantity },
        () => "ticket"
    );
};

const imageSource = image => {
    if (!image) return "";

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {
        return image;
    }

    return `${API}/uploads/${image}`;
};

function AdminDashboard() {
    const [activeSection, setActiveSection] =
        useState("dashboard");

    const [data, setData] = useState(null);
    const [events, setEvents] = useState([]);
    const [requests, setRequests] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [eventSearch, setEventSearch] = useState("");
    const [eventCategory, setEventCategory] =
        useState("All");
    const [eventOrder, setEventOrder] =
        useState("nearest");

    const [bookingSearch, setBookingSearch] =
        useState("");

    const [userSearch, setUserSearch] =
        useState("");

    const [requestFilter, setRequestFilter] =
        useState("All");

    const [ticketId, setTicketId] = useState("");

    const [
        verificationLoading,
        setVerificationLoading
    ] = useState(false);

    const [
        verificationResult,
        setVerificationResult
    ] = useState(null);

    const [
        showEventModal,
        setShowEventModal
    ] = useState(false);

    const [
        editingEvent,
        setEditingEvent
    ] = useState(null);

    const [
        eventForm,
        setEventForm
    ] = useState({ ...EMPTY_EVENT });

    const [
        selectedEvent,
        setSelectedEvent
    ] = useState(null);

    const [
        selectedRequest,
        setSelectedRequest
    ] = useState(null);

    const admin = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("adminUser") ||
                '{"username":"admin","role":"admin"}'
            );
        } catch {
            return {
                username: "admin",
                role: "admin"
            };
        }
    }, []);

    const get = useCallback(async path => {
        const join = path.includes("?")
            ? "&"
            : "?";

        const response = await fetch(
            `${API}${path}${join}_=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        let result = {};

        try {
            result = await response.json();
        } catch {
            result = {};
        }

        if (
            !response.ok ||
            result.success === false
        ) {
            throw new Error(
                result.message ||
                `Request failed (${response.status})`
            );
        }

        return result.data ?? result;
    }, []);

    const fetchStats = useCallback(async () => {
        setData(await get("/admin/stats"));
    }, [get]);

    const fetchEvents = useCallback(async () => {
        const result = await get("/admin/events");

        setEvents(
            Array.isArray(result)
                ? result
                : result?.events || []
        );
    }, [get]);

    const fetchRequests = useCallback(async () => {
        const result = await get("/admin/requests");

        setRequests(
            Array.isArray(result)
                ? result
                : result?.requests || []
        );
    }, [get]);

    const fetchBookings = useCallback(async () => {
        const result = await get("/admin/bookings");

        setBookings(
            Array.isArray(result)
                ? result
                : result?.bookings || []
        );
    }, [get]);

    const fetchUsers = useCallback(async () => {
        const result = await get("/admin/users");

        setUsers(
            Array.isArray(result)
                ? result
                : result?.users || []
        );
    }, [get]);

    const fetchPayments = useCallback(async () => {
        const result = await get("/admin/payments");

        setPayments(
            Array.isArray(result)
                ? result
                : result?.payments ||
                  result?.data ||
                  []
        );
    }, [get]);

    const loadAll = useCallback(
        async initial => {
            if (initial) {
                setLoading(true);
            }

            setError("");

            const results =
                await Promise.allSettled([
                    fetchStats(),
                    fetchEvents(),
                    fetchRequests(),
                    fetchBookings(),
                    fetchUsers(),
                    fetchPayments()
                ]);

            const failed = results.find(
                result =>
                    result.status === "rejected"
            );

            if (failed) {
                setError(
                    failed.reason?.message ||
                    "Unable to load admin data."
                );
            }

            if (initial) {
                setLoading(false);
            }
        },
        [
            fetchStats,
            fetchEvents,
            fetchRequests,
            fetchBookings,
            fetchUsers,
            fetchPayments
        ]
    );

    useEffect(() => {
        if (
            localStorage.getItem("admin") !==
            "true"
        ) {
            window.location.href = "/login";
            return;
        }

        loadAll(true);

        const timer = setInterval(
            () => loadAll(false),
            15000
        );

        return () => clearInterval(timer);
    }, [loadAll]);

    const showNotice = message => {
        setNotice(message);

        window.setTimeout(
            () => setNotice(""),
            3500
        );
    };

    const fail = err => {
        console.error(err);

        setError(
            err?.message ||
            "Something went wrong."
        );
    };

    const logout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminUser");
        localStorage.removeItem(
            "adminSessionStarted"
        );

        window.location.href = "/login";
    };

    const openAddEvent = () => {
        setEditingEvent(null);
        setEventForm({ ...EMPTY_EVENT });
        setShowEventModal(true);
    };

    const openEditEvent = event => {
        setEditingEvent(event);

        setEventForm({
            ...EMPTY_EVENT,
            ...event,
            price:
                event.price ??
                event.ticketPrice ??
                ""
        });

        setShowEventModal(true);
    };

    const saveEvent = async event => {
        event.preventDefault();

        setBusy(true);
        setError("");

        try {
            const url = editingEvent
                ? `${API}/admin/events/${editingEvent._id}`
                : `${API}/admin/events`;

            const payload =
                Object.fromEntries(
                    Object.keys(EMPTY_EVENT).map(
                        key => [
                            key,
                            eventForm[key] ?? ""
                        ]
                    )
                );

            const response = await fetch(
                url,
                {
                    method: editingEvent
                        ? "PUT"
                        : "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(payload)
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Unable to save event."
                );
            }

            setShowEventModal(false);

            await Promise.all([
                fetchEvents(),
                fetchStats(),
                fetchRequests()
            ]);

            showNotice(
                editingEvent
                    ? "Event updated successfully."
                    : "Event created successfully."
            );
        } catch (err) {
            fail(err);
        } finally {
            setBusy(false);
        }
    };

    const deleteEvent = async id => {
        if (
            !window.confirm(
                "Are you sure you want to delete this event?"
            )
        ) {
            return;
        }

        setBusy(true);

        try {
            const response =
                await fetch(
                    `${API}/admin/events/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Unable to delete event."
                );
            }

            await Promise.all([
                fetchEvents(),
                fetchStats()
            ]);

            setSelectedEvent(null);

            showNotice(
                "Event deleted successfully."
            );
        } catch (err) {
            fail(err);
        } finally {
            setBusy(false);
        }
    };

    const requestAction = async (
        id,
        action
    ) => {
        setBusy(true);

        try {
            const response =
                await fetch(
                    `${API}/admin/requests/${id}/${action}`,
                    {
                        method: "PUT"
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Unable to update request."
                );
            }

            await Promise.all([
                fetchRequests(),
                fetchEvents(),
                fetchStats()
            ]);

            setSelectedRequest(null);

            showNotice(
                action === "approve"
                    ? "Event request approved successfully."
                    : "Event request rejected successfully."
            );
        } catch (err) {
            fail(err);
        } finally {
            setBusy(false);
        }
    };

    const deleteRequest = async id => {
        if (
            !window.confirm(
                "Delete this event request?"
            )
        ) {
            return;
        }

        setBusy(true);

        try {
            const response =
                await fetch(
                    `${API}/admin/requests/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Unable to delete request."
                );
            }

            await Promise.all([
                fetchRequests(),
                fetchStats()
            ]);

            setSelectedRequest(null);

            showNotice(
                "Request deleted."
            );
        } catch (err) {
            fail(err);
        } finally {
            setBusy(false);
        }
    };

    const toggleUserStatus =
        async user => {
            const status =
                user.status === "Blocked"
                    ? "Active"
                    : "Blocked";

            setBusy(true);

            try {
                const response =
                    await fetch(
                        `${API}/admin/users/${user._id}/status`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    status
                                })
                        }
                    );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    result.success === false
                ) {
                    throw new Error(
                        result.message ||
                        "Unable to update user."
                    );
                }

                await Promise.all([
                    fetchUsers(),
                    fetchStats()
                ]);

                showNotice(
                    status === "Blocked"
                        ? "User blocked successfully."
                        : "User unblocked successfully."
                );
            } catch (err) {
                fail(err);
            } finally {
                setBusy(false);
            }
        };

    const verifyTicket = async () => {
        const id = ticketId.trim();

        if (!id) {
            setVerificationResult({
                success: false,
                message:
                    "Please enter a Ticket ID."
            });

            return;
        }

        setVerificationLoading(true);
        setVerificationResult(null);

        try {
            const response =
                await fetch(
                    `${API}/booking/verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body:
                            JSON.stringify({
                                ticketId: id
                            })
                    }
                );

            const result =
                await response.json();

            const message =
                result.message ||
                "Ticket verification failed.";

            if (
                !response.ok ||
                result.success === false
            ) {
                setVerificationResult({
                    success: false,
                    message:
                        message
                            .toLowerCase()
                            .includes("used")
                            ? "Ticket already used."
                            : message
                });

                return;
            }

            setTicketId("");

            setVerificationResult({
                success: true,
                message:
                    message ||
                    "Entry allowed. Ticket marked as Used."
            });

            await Promise.all([
                fetchStats(),
                fetchBookings()
            ]);
        } catch (err) {
            setVerificationResult({
                success: false,
                message:
                    err.message ||
                    "Unable to verify ticket."
            });
        } finally {
            setVerificationLoading(false);
        }
    };

    const approvedEvents = useMemo(
        () =>
            events.filter(event => {
                const status =
                    String(
                        event.status ||
                        "Approved"
                    )
                        .trim()
                        .toLowerCase();

                return (
                    !status ||
                    status === "approved"
                );
            }),
        [events]
    );

    const eventCategories=useMemo(()=>[
    "All",
    ...Array.from(new Set(events.map(event=>event.category).filter(Boolean))).sort()
],[events]);

    const upcomingEvents =
        useMemo(
            () =>
                approvedEvents
                    .filter(event =>
                        isUpcomingWithinTwoWeeks(
                            event.date
                        )
                    )
                    .sort(
                        (a, b) =>
                            (
                                dateValue(
                                    a.date
                                )?.getTime() ||
                                Infinity
                            ) -
                            (
                                dateValue(
                                    b.date
                                )?.getTime() ||
                                Infinity
                            )
                    ),
            [approvedEvents]
        );

    const filteredEvents=useMemo(()=>{
    const q=eventSearch.trim().toLowerCase();
    const filtered=events.filter(event=>{
        const searchable=[eventNameOf(event),event.category,event.city,event.venue,event.organizerName].join(" ").toLowerCase();
        const matchesSearch=!q||searchable.includes(q);
        const matchesCategory=eventCategory==="All"||event.category===eventCategory;
        return matchesSearch&&matchesCategory;
    });
    return filtered.sort((a,b)=>{
        const aTime=dateValue(a.date)?.getTime()||0;
        const bTime=dateValue(b.date)?.getTime()||0;
        return eventOrder==="nearest"?aTime-bTime:bTime-aTime;
    });
},[events,eventSearch,eventCategory,eventOrder]);

    const filteredBookings =
        useMemo(() => {
            const query =
                bookingSearch
                    .trim()
                    .toLowerCase();

            return bookings.filter(
                booking =>
                    [
                        booking.eventName,
                        booking.userId?.name,
                        booking.userId?.email,
                        booking.transactionId,
                        booking.ticketId
                    ].some(value =>
                        String(value || "")
                            .toLowerCase()
                            .includes(query)
                    )
            );
        }, [bookings, bookingSearch]);

    const filteredUsers =
        useMemo(() => {
            const query =
                userSearch
                    .trim()
                    .toLowerCase();

            return users.filter(user =>
                [
                    user.name,
                    user.email,
                    user.phone,
                    user.role,
                    user.status
                ].some(value =>
                    String(value || "")
                        .toLowerCase()
                        .includes(query)
                )
            );
        }, [users, userSearch]);

    const filteredRequests =
        useMemo(
            () =>
                requestFilter === "All"
                    ? requests
                    : requests.filter(
                          request =>
                              request.status ===
                              requestFilter
                      ),
            [requests, requestFilter]
        );

    const dashboardStats =
        useMemo(() => {
            const totalUsers =
                Number(
                    data?.users?.total ??
                    users.length
                );

            const totalEvents =
                Number(
                    data?.events?.total ??
                    events.length
                );

            const usedTickets =
                Number(
                    data?.bookings?.used ??
                    bookings.filter(
                        booking =>
                            String(
                                booking.ticketStatus ||
                                booking.status ||
                                ""
                            ).toLowerCase() ===
                            "used"
                    ).length
                );

            const totalRevenue =
                Number(
                    data?.revenue ??
                    payments
                        .filter(
                            payment =>
                                String(
                                    payment.paymentStatus ||
                                    payment.status ||
                                    ""
                                ).toLowerCase() ===
                                "successful"
                        )
                        .reduce(
                            (sum, payment) =>
                                sum +
                                Number(
                                    payment.amount ||
                                    0
                                ),
                            0
                        )
                );

            return {
                totalUsers,
                totalEvents,
                upcomingEvents:
                    upcomingEvents.length,
                usedTickets,
                totalRevenue
            };
        }, [
            data,
            users.length,
            events.length,
            bookings,
            payments,
            upcomingEvents.length
        ]);

    const successfulBookings =
        useMemo(
            () =>
                bookings.filter(
                    booking => {
                        const status =
                            String(
                                booking.paymentStatus ||
                                booking.status ||
                                ""
                            ).toLowerCase();

                        return (
                            status ===
                                "successful" ||
                            status === "paid"
                        );
                    }
                ),
            [bookings]
        );

    const lastSevenDays =
        useMemo(() => {
            const result = [];

            for (
                let offset = 6;
                offset >= 0;
                offset--
            ) {
                const day = new Date();

                day.setHours(0, 0, 0, 0);
                day.setDate(
                    day.getDate() - offset
                );

                const next = new Date(day);

                next.setDate(
                    next.getDate() + 1
                );

                const dayBookings =
                    successfulBookings.filter(
                        booking => {
                            const created =
                                dateValue(
                                    booking.createdAt ||
                                    booking.date
                                );

                            return (
                                created &&
                                created >= day &&
                                created < next
                            );
                        }
                    );

                result.push({
                    date: day,
                    label:
                        day.toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "short"
                            }
                        ),
                    count:
                        dayBookings.length,
                    revenue:
                        dayBookings.reduce(
                            (
                                sum,
                                booking
                            ) =>
                                sum +
                                Number(
                                    booking.amount ||
                                    0
                                ),
                            0
                        )
                });
            }

            return result;
        }, [successfulBookings]);

    const recentBookings =
        useMemo(
            () =>
                [...bookings]
                    .sort(
                        (a, b) =>
                            (
                                dateValue(
                                    b.createdAt ||
                                    b.date
                                )?.getTime() ||
                                0
                            ) -
                            (
                                dateValue(
                                    a.createdAt ||
                                    a.date
                                )?.getTime() ||
                                0
                            )
                    )
                    .slice(0, 6),
            [bookings]
        );

    const recentActivity =
        useMemo(() => {
            const items = [];

            bookings.forEach(item => {
                items.push({
                    id:
                        `booking-${item._id}`,
                    date:
                        item.createdAt ||
                        item.date,
                    type: "booking",
                    icon: "🎟️",
                    title:
                        `New booking for ${
                            item.eventName ||
                            "an event"
                        }`,
                    detail:
                        item.userId?.name ||
                        item.userName ||
                        "Customer",
                    amount: item.amount
                });
            });

            payments.forEach(item => {
                items.push({
                    id:
                        `payment-${
                            item._id ||
                            item.transactionId
                        }`,
                    date:
                        item.createdAt ||
                        item.date,
                    type: "payment",
                    icon: "💳",
                    title:
                        "Payment received",
                    detail:
                        item.eventName ||
                        item.transactionId ||
                        "Transaction",
                    amount: item.amount
                });
            });

            requests.forEach(item => {
                items.push({
                    id:
                        `request-${item._id}`,
                    date:
                        item.createdAt ||
                        item.submittedAt ||
                        item.date,
                    type: "request",
                    icon: "📩",
                    title:
                        `Event request: ${
                            eventNameOf(item)
                        }`,
                    detail:
                        item.organizerName ||
                        item.email ||
                        "Organizer"
                });
            });

            users.forEach(item => {
                items.push({
                    id:
                        `user-${item._id}`,
                    date:
                        item.lastLoginAt ||
                        item.lastLogin ||
                        item.createdAt,
                    type: "user",
                    icon: "👤",
                    title:
                        item.lastLoginAt ||
                        item.lastLogin
                            ? "User logged in"
                            : "New user account",
                    detail:
                        item.name ||
                        item.email ||
                        "User"
                });
            });

            return items
                .filter(item => item.date)
                .sort(
                    (a, b) =>
                        (
                            dateValue(
                                b.date
                            )?.getTime() ||
                            0
                        ) -
                        (
                            dateValue(
                                a.date
                            )?.getTime() ||
                            0
                        )
                )
                .slice(0, 8);
        }, [
            bookings,
            payments,
            requests,
            users
        ]);

    const requestCounts =
        useMemo(
            () => ({
                total: requests.length,
                pending:
                    requests.filter(
                        item =>
                            item.status ===
                            "Pending"
                    ).length,
                approved:
                    requests.filter(
                        item =>
                            item.status ===
                            "Approved"
                    ).length,
                rejected:
                    requests.filter(
                        item =>
                            item.status ===
                            "Rejected"
                    ).length
            }),
            [requests]
        );

    const eventCounts =
        useMemo(
            () => ({
                total: events.length,
                approved:
                    events.filter(
                        item =>
                            String(
                                item.status ||
                                "Approved"
                            ).toLowerCase() ===
                            "approved"
                    ).length,
                upcoming:
                    events.filter(
                        item =>
                            isFutureEvent(
                                item.date
                            ) &&
                            String(
                                item.status ||
                                "Approved"
                            ).toLowerCase() !==
                                "rejected"
                    ).length,
                pending:
                    requests.filter(
                        item =>
                            item.status ===
                            "Pending"
                    ).length,
                rejected:
                    events.filter(
                        item =>
                            String(
                                item.status ||
                                ""
                            ).toLowerCase() ===
                            "rejected"
                    ).length
            }),
            [events, requests]
        );

    const bookingActivityTotal =
        lastSevenDays.reduce(
            (sum, item) =>
                sum + item.count,
            0
        );

    const bookingRevenueTotal =
        lastSevenDays.reduce(
            (sum, item) =>
                sum + item.revenue,
            0
        );

    if (loading && !data) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner" />
                <h2>
                    Loading TheShowSpot
                </h2>
                <p>
                    Preparing the admin
                    dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="admin-shell">

            <aside className="admin-sidebar">

                <div className="sidebar-brand">
                    <strong>
                        🎟️ TheShowSpot
                    </strong>
                    <span>
                        Admin Dashboard
                    </span>
                </div>

                <nav className="admin-nav">
                    {NAV.map(
                        ([
                            id,
                            icon,
                            label
                        ]) => (
                            <button
                                key={id}
                                className={
                                    activeSection ===
                                    id
                                        ? "nav-item active"
                                        : "nav-item"
                                }
                                onClick={() =>
                                    setActiveSection(
                                        id
                                    )
                                }
                            >
                                <span>
                                    {icon}
                                </span>

                                <span>
                                    {label}
                                </span>

                                {id ===
                                    "requests" &&
                                    requestCounts.pending >
                                        0 && (
                                        <b>
                                            {
                                                requestCounts.pending
                                            }
                                        </b>
                                    )}
                            </button>
                        )
                    )}
                </nav>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    🚪 Logout
                </button>

            </aside>

            <main className="admin-main">

                <header className="top-header">

                    <div className="top-header-brand">
                        <strong>
                            🎟️ TheShowSpot
                        </strong>

                        <span>
                            Admin Dashboard
                        </span>
                    </div>

                    <div className="header-actions">

                        <button
                            className="refresh-button"
                            onClick={() =>
                                loadAll(false)
                            }
                            title="Refresh"
                        >
                            ↻
                        </button>

                        <div className="admin-profile">

                            <div className="admin-avatar">
                                {String(
                                    admin.username ||
                                    "A"
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <strong>
                                    {
                                        admin.username ||
                                        "Admin"
                                    }
                                </strong>

                                <span>
                                    Administrator
                                </span>
                            </div>

                        </div>

                    </div>

                </header>

                <div className="page-content">

                    {notice && (
                        <div className="toast success">
                            ✓ {notice}
                        </div>
                    )}

                    {error && (
                        <div className="toast error">
                            <span>
                                {error}
                            </span>

                            <button
                                onClick={() =>
                                    setError("")
                                }
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {activeSection ===
                        "dashboard" && (
                        <DashboardPage
                            stats={
                                dashboardStats
                            }
                            data={data}
                            upcomingEvents={
                                upcomingEvents
                            }
                            pendingRequests={requests
                                .filter(
                                    request =>
                                        request.status ===
                                        "Pending"
                                )
                                .sort(
                                    (a, b) =>
                                        (
                                            dateValue(
                                                a.date
                                            )?.getTime() ||
                                            Infinity
                                        ) -
                                        (
                                            dateValue(
                                                b.date
                                            )?.getTime() ||
                                            Infinity
                                        )
                                )
                                .slice(0, 4)}
                            bookings={bookings}
                            recentBookings={
                                recentBookings
                            }
                            recentActivity={
                                recentActivity
                            }
                            requestCounts={
                                requestCounts
                            }
                            eventCounts={
                                eventCounts
                            }
                            lastSevenDays={
                                lastSevenDays
                            }
                            bookingActivityTotal={
                                bookingActivityTotal
                            }
                            bookingRevenueTotal={
                                bookingRevenueTotal
                            }
                            money={money}
                            formatDate={
                                formatDate
                            }
                            setActiveSection={
                                setActiveSection
                            }
                            openAddEvent={
                                openAddEvent
                            }
                            ticketId={ticketId}
                            setTicketId={
                                setTicketId
                            }
                            verifyTicket={
                                verifyTicket
                            }
                            verificationLoading={
                                verificationLoading
                            }
                            verificationResult={
                                verificationResult
                            }
                        />
                    )}

                    {activeSection ===
                        "events" && (
                        <EventsPage
                            events={
                                filteredEvents
                            }
                            upcomingEvents={
                                upcomingEvents
                            }
                            search={
                                eventSearch
                            }
                            setSearch={
                                setEventSearch
                            }
                            category={
                                eventCategory
                            }
                            setCategory={
                                setEventCategory
                            }
                            order={
                                eventOrder
                            }
                            setOrder={
                                setEventOrder
                            }
                            categories={
                                eventCategories
                            }
                            openAddEvent={
                                openAddEvent
                            }
                            openEditEvent={
                                openEditEvent
                            }
                            deleteEvent={
                                deleteEvent
                            }
                            openDetails={
                                setSelectedEvent
                            }
                            money={money}
                            formatDate={
                                formatDate
                            }
                        />
                    )}

                    {activeSection ===
                        "requests" && (
                        <RequestsPage
                            requests={
                                filteredRequests
                            }
                            filter={
                                requestFilter
                            }
                            setFilter={
                                setRequestFilter
                            }
                            counts={
                                requestCounts
                            }
                            openDetails={
                                setSelectedRequest
                            }
                            approve={id =>
                                requestAction(
                                    id,
                                    "approve"
                                )
                            }
                            reject={id =>
                                requestAction(
                                    id,
                                    "reject"
                                )
                            }
                            remove={
                                deleteRequest
                            }
                            money={money}
                            formatDate={
                                formatDate
                            }
                        />
                    )}

                    {activeSection ===
                        "bookings" && (
                        <BookingsPage
                            bookings={
                                filteredBookings
                            }
                            search={
                                bookingSearch
                            }
                            setSearch={
                                setBookingSearch
                            }
                            money={money}
                            formatDate={
                                formatDate
                            }
                        />
                    )}

                    {activeSection ===
                        "users" && (
                        <UsersPage
                            users={
                                filteredUsers
                            }
                            search={
                                userSearch
                            }
                            setSearch={
                                setUserSearch
                            }
                            toggle={
                                toggleUserStatus
                            }
                            formatDate={
                                formatDate
                            }
                        />
                    )}

                    {activeSection ===
                        "payments" && (
                        <PaymentsPage
                            payments={
                                payments
                            }
                            money={money}
                            formatDate={
                                formatDate
                            }
                        />
                    )}

                </div>
            </main>

            {showEventModal && (
                <EventModal
                    form={eventForm}
                    setForm={setEventForm}
                    editing={
                        editingEvent
                    }
                    save={saveEvent}
                    close={() =>
                        setShowEventModal(
                            false
                        )
                    }
                    busy={busy}
                    money={money}
                    formatDate={
                        formatDate
                    }
                />
            )}

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    bookings={bookings}
                    money={money}
                    formatDate={
                        formatDate
                    }
                    close={() =>
                        setSelectedEvent(
                            null
                        )
                    }
                    edit={() => {
                        setSelectedEvent(
                            null
                        );

                        openEditEvent(
                            selectedEvent
                        );
                    }}
                    remove={() =>
                        deleteEvent(
                            selectedEvent._id
                        )
                    }
                />
            )}

            {selectedRequest && (
                <RequestDetailsModal
                    request={
                        selectedRequest
                    }
                    money={money}
                    formatDate={
                        formatDate
                    }
                    close={() =>
                        setSelectedRequest(
                            null
                        )
                    }
                    approve={() =>
                        requestAction(
                            selectedRequest._id,
                            "approve"
                        )
                    }
                    reject={() =>
                        requestAction(
                            selectedRequest._id,
                            "reject"
                        )
                    }
                    remove={() =>
                        deleteRequest(
                            selectedRequest._id
                        )
                    }
                />
            )}

        </div>
    );
}

function DashboardPage({
    stats,
    data,
    upcomingEvents,
    pendingRequests,
    recentBookings,
    recentActivity,
    requestCounts,
    eventCounts,
    lastSevenDays,
    bookingActivityTotal,
    bookingRevenueTotal,
    money,
    formatDate,
    setActiveSection,
    openAddEvent,
    ticketId,
    setTicketId,
    verifyTicket,
    verificationLoading,
    verificationResult
}) {
    const max = Math.max(
        ...lastSevenDays.map(
            item => item.count
        ),
        1
    );

    return (
        <section className="dashboard-page">

            <section className="welcome-card">

                <div>
                    <span className="eyebrow">
                        OVERVIEW
                    </span>

                    <h1>
                        Welcome Back, Admin! 👋
                    </h1>

                    <p>
                        Here's what's happening
                        across TheShowSpot today.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={openAddEvent}
                >
                    ＋ Add New Event
                </button>

            </section>

            <section className="stats-grid">

                <StatCard
                    icon="👥"
                    label="Total Users"
                    value={
                        stats.totalUsers
                    }
                    note={
                        data?.users?.active ??
                        "Live data"
                    }
                />

                <StatCard
                    icon="🎫"
                    label="Total Events"
                    value={
                        stats.totalEvents
                    }
                    note={`${eventCounts.approved} approved`}
                />

                <StatCard
                    icon="📅"
                    label="Upcoming Events"
                    value={
                        stats.upcomingEvents
                    }
                    note="Next 2 weeks"
                />

                <StatCard
                    icon="✓"
                    label="Used Tickets"
                    value={
                        stats.usedTickets
                    }
                    note="Verified at entry"
                />

                <StatCard
                    icon="₹"
                    label="Total Revenue"
                    value={money(
                        stats.totalRevenue
                    )}
                    note="Successful payments"
                />

            </section>

            <section className="quick-bar">

                <div>
                    <span className="eyebrow">
                        QUICK ACTIONS
                    </span>

                    <h3>
                        Manage TheShowSpot
                    </h3>
                </div>

                <div className="quick-actions">
                    <button
                        onClick={openAddEvent}
                    >
                        ＋ Add Event
                    </button>

                    <button
                        onClick={() =>
                            setActiveSection(
                                "users"
                            )
                        }
                    >
                        👥 Manage Users
                    </button>

                    <button
                        onClick={() =>
                            setActiveSection(
                                "requests"
                            )
                        }
                    >
                        📩 Review Requests
                    </button>

                    <button
                        onClick={() =>
                            setActiveSection(
                                "bookings"
                            )
                        }
                    >
                        🎟️ View Bookings
                    </button>
                </div>

            </section>

            <section className="panel verification-panel">

                <SectionTitle
                    eyebrow="TICKET VERIFICATION"
                    title="Verify Ticket"
                    subtitle="Enter a ticket ID to verify entry. A ticket can only be used once."
                />

                <div className="verification-form">

                    <input
                        value={ticketId}
                        onChange={e =>
                            setTicketId(
                                e.target.value
                            )
                        }
                        onKeyDown={e => {
                            if (
                                e.key ===
                                "Enter"
                            ) {
                                verifyTicket();
                            }
                        }}
                        placeholder="Enter ticket ID..."
                        disabled={
                            verificationLoading
                        }
                    />

                    <button
                        className="primary-button"
                        onClick={
                            verifyTicket
                        }
                        disabled={
                            verificationLoading
                        }
                    >
                        {verificationLoading
                            ? "Verifying..."
                            : "Verify Ticket"}
                    </button>

                </div>

                <p className="verification-help">
                    Only successfully paid tickets
                    with <strong>Valid</strong>{" "}
                    status can be verified.
                </p>

                {verificationResult && (
                    <div
                        className={
                            verificationResult.success
                                ? "verification-result success"
                                : "verification-result error"
                        }
                    >
                        {verificationResult.success
                            ? "✓"
                            : "✕"}{" "}
                        {
                            verificationResult.message
                        }
                    </div>
                )}

            </section>

            <section className="section-block">

                <SectionTitle
                    eyebrow="UPCOMING EVENTS"
                    title="Events in the next 2 weeks"
                    subtitle="Only events scheduled from today through the next 14 days are shown here."
                    action="View All →"
                    onAction={() =>
                        setActiveSection(
                            "events"
                        )
                    }
                />

                {upcomingEvents.length ? (
                    <div className="event-grid five">
                        {upcomingEvents.map(
                            event => (
                                <EventCard
                                    key={
                                        event._id
                                    }
                                    event={
                                        event
                                    }
                                    money={
                                        money
                                    }
                                    formatDate={
                                        formatDate
                                    }
                                    compact
                                />
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="No approved events are scheduled in the next 2 weeks." />
                )}

            </section>

            <div className="two-column">

                <section className="panel">

                    <SectionTitle
                        eyebrow="BOOKING HISTORY"
                        title="Last 7 days"
                        subtitle="Live successful bookings and revenue."
                        action="View Bookings →"
                        onAction={() =>
                            setActiveSection(
                                "bookings"
                            )
                        }
                    />

                    <div className="chart">

                        {lastSevenDays.map(
                            item => (
                                <div
                                    className="chart-day"
                                    key={item.date.toISOString()}
                                >
                                    <span>
                                        {
                                            item.count
                                        }
                                    </span>

                                    <div className="chart-track">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${
                                                    item.count
                                                        ? Math.max(
                                                              (
                                                                  item.count /
                                                                  max
                                                              ) *
                                                                  100,
                                                              8
                                                          )
                                                        : 3
                                                }%`
                                            }}
                                        />
                                    </div>

                                    <small>
                                        {
                                            item.label
                                        }
                                    </small>
                                </div>
                            )
                        )}

                    </div>

                    <div className="chart-summary">

                        <div>
                            <span>
                                Total bookings
                            </span>

                            <strong>
                                {
                                    bookingActivityTotal
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Revenue
                            </span>

                            <strong>
                                {money(
                                    bookingRevenueTotal
                                )}
                            </strong>
                        </div>

                    </div>

                </section>

                <section className="panel">

                    <SectionTitle
                        eyebrow="EVENT STATUS"
                        title="Platform overview"
                        subtitle="Current event and request status."
                        action="Review Requests →"
                        onAction={() =>
                            setActiveSection(
                                "requests"
                            )
                        }
                    />

                    <div className="status-list">

                        <StatusMetric
                            icon="🎫"
                            label="Total Events"
                            value={
                                eventCounts.total
                            }
                        />

                        <StatusMetric
                            icon="✓"
                            label="Approved Events"
                            value={
                                eventCounts.approved
                            }
                        />

                        <StatusMetric
                            icon="⏳"
                            label="Pending Requests"
                            value={
                                eventCounts.pending
                            }
                        />

                        <StatusMetric
                            icon="✕"
                            label="Rejected Events"
                            value={
                                eventCounts.rejected
                            }
                        />

                        <StatusMetric
                            icon="📅"
                            label="Upcoming Events"
                            value={
                                eventCounts.upcoming
                            }
                        />

                    </div>

                </section>

            </div>

            <div className="two-column">

                <section className="panel">

                    <SectionTitle
                        eyebrow="RECENT BOOKINGS"
                        title="Latest bookings"
                        subtitle="Newest transactions, sorted by booking date."
                        action="View All →"
                        onAction={() =>
                            setActiveSection(
                                "bookings"
                            )
                        }
                    />

                    {recentBookings.length ? (
                        <div className="recent-list">

                            {recentBookings.map(
                                booking => (
                                    <div
                                        className="recent-row"
                                        key={
                                            booking._id
                                        }
                                    >

                                        <div className="recent-icon">
                                            🎟️
                                        </div>

                                        <div className="recent-main">
                                            <strong>
                                                {
                                                    booking.eventName ||
                                                    "Event"
                                                }
                                            </strong>

                                            <span>
                                                {formatDate(
                                                    booking.createdAt ||
                                                        booking.date
                                                )}{" "}
                                                ·{" "}
                                                {booking.category ||
                                                    booking
                                                        .eventId
                                                        ?.category ||
                                                    "Event"}
                                            </span>

                                            <small>
                                                {booking
                                                    .userId
                                                    ?.name ||
                                                    booking.userName ||
                                                    "Customer"}
                                            </small>
                                        </div>

                                        <strong>
                                            {money(
                                                booking.amount
                                            )}
                                        </strong>

                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <EmptyState text="No bookings found." />
                    )}

                </section>

                <section className="panel">

                    <SectionTitle
                        eyebrow="PENDING REQUESTS"
                        title="Organizer submissions"
                        subtitle="Requests waiting for admin review."
                        action="View All →"
                        onAction={() =>
                            setActiveSection(
                                "requests"
                            )
                        }
                    />

                    {pendingRequests.length ? (
                        <div className="pending-list">

                            {pendingRequests.map(
                                request => (
                                    <div
                                        className="pending-row"
                                        key={
                                            request._id
                                        }
                                    >

                                        <div className="pending-icon">
                                            📩
                                        </div>

                                        <div>
                                            <strong>
                                                {
                                                    eventNameOf(
                                                        request
                                                    )
                                                }
                                            </strong>

                                            <span>
                                                📅{" "}
                                                {formatDate(
                                                    request.date
                                                )}{" "}
                                                · 📍{" "}
                                                {request.city ||
                                                    request.location ||
                                                    "Location not provided"}
                                            </span>

                                            <small>
                                                {request.organizerName ||
                                                    "Organizer"}{" "}
                                                ·{" "}
                                                {money(
                                                    request.ticketPrice ??
                                                        request.price
                                                )}
                                            </small>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setActiveSection(
                                                    "requests"
                                                )
                                            }
                                        >
                                            View Request →
                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <EmptyState text="No pending requests." />
                    )}

                </section>

            </div>

            <section className="panel activity-panel">

                <SectionTitle
                    eyebrow="RECENT ACTIVITY"
                    title="What's happening across TheShowSpot"
                    subtitle="Latest bookings, payments, requests and user activity."
                />

                {recentActivity.length ? (
                    <div className="activity-list">

                        {recentActivity.map(
                            item => (
                                <div
                                    className="activity-row"
                                    key={item.id}
                                >

                                    <div
                                        className={`activity-icon ${item.type}`}
                                    >
                                        {
                                            item.icon
                                        }
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                item.title
                                            }
                                        </strong>

                                        <span>
                                            {
                                                item.detail
                                            }
                                        </span>
                                    </div>

                                    <div className="activity-right">
                                        {item.amount !==
                                            undefined && (
                                            <strong>
                                                {money(
                                                    item.amount
                                                )}
                                            </strong>
                                        )}

                                        <span>
                                            {formatDate(
                                                item.date
                                            )}
                                        </span>
                                    </div>

                                </div>
                            )
                        )}

                    </div>
                ) : (
                    <EmptyState text="No recent activity available." />
                )}

            </section>

        </section>
    );
}

function EventsPage({
    events,
    upcomingEvents,
    search,
    setSearch,
    category,
    setCategory,
    order,
    setOrder,
    categories,
    openAddEvent,
    openEditEvent,
    deleteEvent,
    openDetails,
    money,
    formatDate
}) {
    const grouped = useMemo(() => {
        const map = {};

        events.forEach(event => {
            const key =
                event.category?.trim() ||
                "Other";

            if (!map[key]) {
                map[key] = [];
            }

            map[key].push(event);
        });

        return Object.entries(map)
            .map(
                ([name, items]) => [
                    name,
                    items.sort(
                        (a, b) =>
                            (
                                dateValue(
                                    a.date
                                )?.getTime() ||
                                Infinity
                            ) -
                            (
                                dateValue(
                                    b.date
                                )?.getTime() ||
                                Infinity
                            )
                    )
                ]
            )
            .sort(([a], [b]) =>
                a.localeCompare(b)
            );
    }, [events]);

    return (
        <section className="management-page">

            <div className="page-heading">

                <div>
                    <span className="eyebrow">
                        EVENT MANAGEMENT
                    </span>

                    <h1>Events</h1>

                    <p>
                        Browse, create and manage
                        approved events on
                        TheShowSpot.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={openAddEvent}
                >
                    ＋ Add New Event
                </button>

            </div>

            <section className="events-box upcoming-box">

                <div className="box-heading">

                    <div>
                        <span className="eyebrow">
                            UPCOMING EVENTS
                        </span>

                        <h2>
                            Next 2 weeks
                        </h2>

                        <p>
                            Approved events happening
                            from today through the
                            next 14 days.
                        </p>
                    </div>

                    <span className="count-badge">
                        {upcomingEvents.length}{" "}
                        event
                        {upcomingEvents.length ===
                        1
                            ? ""
                            : "s"}
                    </span>

                </div>

                {upcomingEvents.length ? (
                    <div className="event-grid five">
                        {upcomingEvents.map(
                            event => (
                                <EventCard
                                    key={
                                        event._id
                                    }
                                    event={
                                        event
                                    }
                                    money={
                                        money
                                    }
                                    formatDate={
                                        formatDate
                                    }
                                    openDetails={
                                        openDetails
                                    }
                                />
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="No approved events are scheduled in the next 2 weeks." />
                )}

            </section>

            <section className="events-box">

                <div className="box-heading">

                    <div>
                        <span className="eyebrow">
                            ALL EVENTS
                        </span>

                        <h2>
                            Browse by category
                        </h2>

                        <p>
                            Search, filter and sort
                            approved events.
                        </p>
                    </div>

                    <span className="count-badge">
                        {events.length} events
                    </span>

                </div>

                <div className="event-filters">

                    <div className="search-box">
                        🔎

                        <input
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search events, cities or organizers..."
                        />
                    </div>

                    <select
                        value={category}
                        onChange={e =>
                            setCategory(
                                e.target.value
                            )
                        }
                    >
                        {categories.map(
                            item => (
                                <option
                                    key={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={order}
                        onChange={e =>
                            setOrder(
                                e.target.value
                            )
                        }
                    >
                        <option value="nearest">
                            Nearest date first
                        </option>

                        <option value="latest">
                            Latest date first
                        </option>
                    </select>

                </div>

                {grouped.length ? (
                    grouped.map(
                        ([name, items]) => (
                            <section
                                className="category-section"
                                key={name}
                            >

                                <div className="category-heading">
                                    <span>
                                        {name
                                            .toLowerCase()
                                            .includes(
                                                "movie"
                                            )
                                            ? "🎬"
                                            : name
                                                  .toLowerCase()
                                                  .includes(
                                                      "sport"
                                                  )
                                            ? "⚽"
                                            : name
                                                  .toLowerCase()
                                                  .includes(
                                                      "workshop"
                                                  )
                                            ? "💻"
                                            : name
                                                  .toLowerCase()
                                                  .includes(
                                                      "music"
                                                  )
                                            ? "🎵"
                                            : name
                                                  .toLowerCase()
                                                  .includes(
                                                      "theatre"
                                                  ) ||
                                              name
                                                  .toLowerCase()
                                                  .includes(
                                                      "show"
                                                  )
                                            ? "🎭"
                                            : "🎟️"}
                                    </span>

                                    <div>
                                        <h3>
                                            {name}
                                        </h3>

                                        <small>
                                            {
                                                items.length
                                            }{" "}
                                            event
                                            {items.length ===
                                            1
                                                ? ""
                                                : "s"}
                                        </small>
                                    </div>
                                </div>

                                <div className="event-grid five">

                                    {items.map(
                                        event => (
                                            <EventCard
                                                key={
                                                    event._id
                                                }
                                                event={
                                                    event
                                                }
                                                money={
                                                    money
                                                }
                                                formatDate={
                                                    formatDate
                                                }
                                                openDetails={
                                                    openDetails
                                                }
                                                openEdit={
                                                    openEditEvent
                                                }
                                                remove={
                                                    deleteEvent
                                                }
                                            />
                                        )
                                    )}

                                </div>

                            </section>
                        )
                    )
                ) : (
                    <EmptyState text="No approved events match your search or filters." />
                )}

            </section>

        </section>
    );
}

function EventCard({
    event,
    money,
    formatDate,
    openDetails,
    openEdit,
    remove,
    compact
}) {
    return (
        <article
            className={
                compact
                    ? "event-card compact"
                    : "event-card"
            }
        >

            <div className="event-image">
                {eventImageOf(event) ? (
                    <img
                        src={imageSource(
                            eventImageOf(event)
                        )}
                        alt={eventNameOf(
                            event
                        )}
                    />
                ) : (
                    <div>
                        🎫
                    </div>
                )}
            </div>

            <div className="event-card-body">

                <span className="category-tag">
                    {event.category ||
                        "Event"}
                </span>

                <h3>
                    {eventNameOf(event)}
                </h3>

                <div className="event-meta">
                    <span>
                        📍{" "}
                        {eventCityOf(event)}
                    </span>

                    <span>
                        📅{" "}
                        {formatDate(
                            event.date
                        )}
                    </span>

                    {event.startTime && (
                        <span>
                            ⏰{" "}
                            {
                                event.startTime
                            }
                        </span>
                    )}
                </div>

                <div className="event-footer">

                    <strong>
                        {money(
                            eventPriceOf(
                                event
                            )
                        )}
                    </strong>

                    <div className="card-actions">

                        {openDetails && (
                            <button
                                onClick={() =>
                                    openDetails(
                                        event
                                    )
                                }
                            >
                                View Details
                            </button>
                        )}

                        {openEdit && (
                            <button
                                onClick={() =>
                                    openEdit(
                                        event
                                    )
                                }
                            >
                                Edit
                            </button>
                        )}

                        {remove && (
                            <button
                                className="danger-text"
                                onClick={() =>
                                    remove(
                                        event._id
                                    )
                                }
                            >
                                Delete
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </article>
    );
}

function RequestsPage({
    requests,
    filter,
    setFilter,
    counts,
    openDetails,
    approve,
    reject,
    remove,
    money,
    formatDate
}) {
    const tabs = [
        ["All", counts.total],
        ["Pending", counts.pending],
        ["Approved", counts.approved],
        ["Rejected", counts.rejected]
    ];

    return (
        <section className="management-page">

            <PageHeading
                eyebrow="ORGANIZER SUBMISSIONS"
                title="Event Requests"
                description="Review event submissions before they appear on the public Events page."
            />

            <div className="request-tabs">

                {tabs.map(
                    ([label, count]) => (
                        <button
                            key={label}
                            className={
                                filter === label
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter(
                                    label
                                )
                            }
                        >
                            {label}
                            <b>{count}</b>
                        </button>
                    )
                )}

            </div>

            <div className="request-grid">

                {requests.length ? (
                    requests.map(
                        request => (
                            <article
                                className="request-card"
                                key={
                                    request._id
                                }
                            >

                                <div className="request-image">
                                    {eventImageOf(
                                        request
                                    ) ? (
                                        <img
                                            src={imageSource(
                                                eventImageOf(
                                                    request
                                                )
                                            )}
                                            alt={eventNameOf(
                                                request
                                            )}
                                        />
                                    ) : (
                                        <span>
                                            📩
                                        </span>
                                    )}
                                </div>

                                <div className="request-content">

                                    <div className="request-top">
                                        <span className="category-tag">
                                            {request.category ||
                                                "Event"}
                                        </span>

                                        <Status
                                            value={
                                                request.status
                                            }
                                        />
                                    </div>

                                    <h3>
                                        {eventNameOf(
                                            request
                                        )}
                                    </h3>

                                    <div className="request-meta">
                                        <span>
                                            📍{" "}
                                            {request.city ||
                                                request.location ||
                                                "—"}
                                        </span>

                                        <span>
                                            📅{" "}
                                            {formatDate(
                                                request.date
                                            )}
                                        </span>

                                        <span>
                                            💰{" "}
                                            {money(
                                                request.ticketPrice ??
                                                    request.price
                                            )}
                                        </span>

                                        <span>
                                            🎟️{" "}
                                            {request.totalSeats ||
                                                "—"}{" "}
                                            seats
                                        </span>
                                    </div>

                                    <p>
                                        {request.organizerName ||
                                            "Organizer"}
                                    </p>

                                    <div className="request-actions">

                                        <button
                                            onClick={() =>
                                                openDetails(
                                                    request
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                        {request.status ===
                                            "Pending" && (
                                            <>
                                                <button
                                                    className="approve"
                                                    onClick={() =>
                                                        approve(
                                                            request._id
                                                        )
                                                    }
                                                >
                                                    ✓ Approve
                                                </button>

                                                <button
                                                    className="reject"
                                                    onClick={() =>
                                                        reject(
                                                            request._id
                                                        )
                                                    }
                                                >
                                                    ✕ Reject
                                                </button>
                                            </>
                                        )}

                                        <button
                                            className="delete-text"
                                            onClick={() =>
                                                remove(
                                                    request._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </article>
                        )
                    )
                ) : (
                    <EmptyState text="No event requests in this category." />
                )}

            </div>

        </section>
    );
}

function BookingsPage({
    bookings,
    search,
    setSearch,
    money,
    formatDate
}) {
    return (
        <section className="management-page">

            <PageHeading
                eyebrow="TICKET TRANSACTIONS"
                title="Bookings"
                description="View every ticket booking and its payment and ticket status."
            />

            <div className="filter-panel">

                <input
                    value={search}
                    onChange={e =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search user, event, ticket or transaction..."
                />

                <span>
                    {bookings.length} bookings
                </span>

            </div>

            <div className="table-panel">

                <table>

                    <thead>
                        <tr>
                            <th>Booking</th>
                            <th>User</th>
                            <th>Seats</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Ticket</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {bookings.map(
                            booking => (
                                <tr
                                    key={
                                        booking._id
                                    }
                                >

                                    <td>
                                        <strong>
                                            {
                                                booking.eventName ||
                                                "Event"
                                            }
                                        </strong>

                                        <small>
                                            Ticket ID:{" "}
                                            {
                                                booking.ticketId ||
                                                "—"
                                            }
                                        </small>

                                        <small>
                                            {
                                                booking.transactionId ||
                                                ""
                                            }
                                        </small>
                                    </td>

                                    <td>
                                        <strong>
                                            {booking
                                                .userId
                                                ?.name ||
                                                booking.userName ||
                                                "Unknown"}
                                        </strong>

                                        <small>
                                            {booking
                                                .userId
                                                ?.email ||
                                                booking.email ||
                                                ""}
                                        </small>
                                    </td>

                                    <td>
                                        {seatsOfBooking(
                                            booking
                                        ).join(
                                            ", "
                                        ) || "—"}
                                    </td>

                                    <td>
                                        <strong>
                                            {money(
                                                booking.amount
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        <Status
                                            value={
                                                booking.paymentStatus ||
                                                booking.status
                                            }
                                        />
                                    </td>

                                    <td>
                                        <Status
                                            value={
                                                booking.ticketStatus ||
                                                "—"
                                            }
                                        />
                                    </td>

                                    <td>
                                        {formatDate(
                                            booking.createdAt ||
                                                booking.date
                                        )}
                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

                {!bookings.length && (
                    <EmptyState text="No bookings found." />
                )}

            </div>

        </section>
    );
}

function UsersPage({
    users,
    search,
    setSearch,
    toggle,
    formatDate
}) {
    return (
        <section className="management-page">

            <PageHeading
                eyebrow="ACCOUNT MANAGEMENT"
                title="Users"
                description="Search accounts and control access to TheShowSpot."
            />

            <div className="filter-panel">

                <input
                    value={search}
                    onChange={e =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search name, email, phone, role or status..."
                />

                <span>
                    {users.length} users
                </span>

            </div>

            <div className="table-panel">

                <table>

                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Login Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map(
                            user => (
                                <tr
                                    key={
                                        user._id
                                    }
                                >

                                    <td>
                                        <strong>
                                            {user.name ||
                                                "—"}
                                        </strong>

                                        <small>
                                            {user.email ||
                                                "—"}
                                        </small>
                                    </td>

                                    <td>
                                        {user.phone ||
                                            "—"}
                                    </td>

                                    <td>
                                        <span className="role-pill">
                                            {user.role ||
                                                "user"}
                                        </span>
                                    </td>

                                    <td>
                                        <Status
                                            value={
                                                user.status ||
                                                "Active"
                                            }
                                        />
                                    </td>

                                    <td>
                                        {formatDate(
                                            user.lastLoginAt ||
                                                user.lastLogin
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            className={
                                                user.status ===
                                                "Blocked"
                                                    ? "table-button unblock"
                                                    : "table-button block"
                                            }
                                            onClick={() =>
                                                toggle(
                                                    user
                                                )
                                            }
                                        >
                                            {user.status ===
                                            "Blocked"
                                                ? "Unblock"
                                                : "Block User"}
                                        </button>
                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

                {!users.length && (
                    <EmptyState text="No users found." />
                )}

            </div>

        </section>
    );
}

function PaymentsPage({
    payments,
    money,
    formatDate
}) {
    const successful =
        payments.filter(
            item =>
                String(
                    item.paymentStatus ||
                    item.status ||
                    ""
                ).toLowerCase() ===
                "successful"
        );

    const pending =
        payments.filter(
            item =>
                String(
                    item.paymentStatus ||
                    item.status ||
                    ""
                ).toLowerCase() ===
                "pending"
        );

    const revenue =
        successful.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.amount || 0
                ),
            0
        );

    return (
        <section className="management-page">

            <PageHeading
                eyebrow="PAYMENT CENTER"
                title="Payments"
                description="Monitor payment transactions and revenue from TheShowSpot."
            />

            <div className="payment-stats">

                <StatCard
                    icon="₹"
                    label="Total Revenue"
                    value={money(
                        revenue
                    )}
                    note="Successful payments"
                />

                <StatCard
                    icon="✓"
                    label="Successful"
                    value={
                        successful.length
                    }
                    note="Completed transactions"
                />

                <StatCard
                    icon="⏳"
                    label="Pending"
                    value={
                        pending.length
                    }
                    note="Awaiting completion"
                />

            </div>

            <div className="table-panel">

                <table>

                    <thead>
                        <tr>
                            <th>Transaction</th>
                            <th>User</th>
                            <th>Event</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {payments.map(
                            payment => (
                                <tr
                                    key={
                                        payment._id ||
                                        payment.transactionId
                                    }
                                >

                                    <td>
                                        <strong>
                                            {payment.transactionId ||
                                                payment.razorpayPaymentId ||
                                                "—"}
                                        </strong>
                                    </td>

                                    <td>
                                        {payment
                                            .userId
                                            ?.name ||
                                            payment.customerName ||
                                            "—"}
                                    </td>

                                    <td>
                                        {payment.eventName ||
                                            "—"}
                                    </td>

                                    <td>
                                        <strong>
                                            {money(
                                                payment.amount
                                            )}
                                        </strong>
                                    </td>

                                    <td>
                                        {payment.method ||
                                            payment.paymentMethod ||
                                            "—"}
                                    </td>

                                    <td>
                                        <Status
                                            value={
                                                payment.paymentStatus ||
                                                payment.status
                                            }
                                        />
                                    </td>

                                    <td>
                                        {formatDate(
                                            payment.createdAt ||
                                                payment.date
                                        )}
                                    </td>

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

                {!payments.length && (
                    <EmptyState text="No payment records found." />
                )}

            </div>

        </section>
    );
}

function EventModal({
    form,
    setForm,
    editing,
    save,
    close,
    busy,
    money,
    formatDate
}) {
    const update = (
        key,
        value
    ) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const categories = [
        "Movies",
        "Music",
        "Sports",
        "Workshop",
        "Comedy",
        "Theatre",
        "Cinema",
        "Conference",
        "Other"
    ];

    return (
        <div
            className="modal-backdrop"
            onMouseDown={e => {
                if (
                    e.target ===
                    e.currentTarget
                ) {
                    close();
                }
            }}
        >

            <div className="event-modal">

                <div className="modal-header">

                    <div>
                        <span className="eyebrow">
                            EVENT FORM
                        </span>

                        <h2>
                            {editing
                                ? "Edit Event"
                                : "Add New Event"}
                        </h2>

                        <p>
                            Enter the event
                            information and
                            see the preview
                            update live.
                        </p>
                    </div>

                    <button
                        onClick={close}
                    >
                        ×
                    </button>

                </div>

                <div className="event-builder">

                    <form
                        className="event-form"
                        onSubmit={save}
                    >

                        <FormField
                            label="Event Name"
                            required
                            value={form.name}
                            onChange={value =>
                                update(
                                    "name",
                                    value
                                )
                            }
                        />

                        <label>
                            Category
                            <select
                                required
                                value={
                                    form.category
                                }
                                onChange={e =>
                                    update(
                                        "category",
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    category => (
                                        <option
                                            key={
                                                category
                                            }
                                        >
                                            {
                                                category
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label>
                            Date
                            <input
                                required
                                type="date"
                                value={
                                    form.date
                                }
                                onChange={e =>
                                    update(
                                        "date",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Start Time
                            <input
                                type="time"
                                value={
                                    form.startTime
                                }
                                onChange={e =>
                                    update(
                                        "startTime",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <label>
                            End Time
                            <input
                                type="time"
                                value={
                                    form.endTime
                                }
                                onChange={e =>
                                    update(
                                        "endTime",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <FormField
                            label="Venue"
                            value={
                                form.venue
                            }
                            onChange={value =>
                                update(
                                    "venue",
                                    value
                                )
                            }
                        />

                        <FormField
                            label="City"
                            value={
                                form.city
                            }
                            onChange={value =>
                                update(
                                    "city",
                                    value
                                )
                            }
                        />

                        <FormField
                            label="Address"
                            value={
                                form.address
                            }
                            onChange={value =>
                                update(
                                    "address",
                                    value
                                )
                            }
                        />

                        <label>
                            Ticket Price
                            <input
                                required
                                type="number"
                                min="0"
                                value={
                                    form.price
                                }
                                onChange={e =>
                                    update(
                                        "price",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Total Seats
                            <input
                                type="number"
                                min="1"
                                value={
                                    form.totalSeats
                                }
                                onChange={e =>
                                    update(
                                        "totalSeats",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <FormField
                            label="Organizer Name"
                            value={
                                form.organizerName
                            }
                            onChange={value =>
                                update(
                                    "organizerName",
                                    value
                                )
                            }
                        />

                        <label>
                            Organizer Email
                            <input
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={e =>
                                    update(
                                        "email",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <FormField
                            label="Organizer Phone"
                            value={
                                form.phone
                            }
                            onChange={value =>
                                update(
                                    "phone",
                                    value
                                )
                            }
                        />

                        <label className="full">
                            Poster / Image URL
                            <input
                                value={
                                    form.image
                                }
                                onChange={e =>
                                    update(
                                        "image",
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="https://..."
                            />
                        </label>

                        <label className="full">
                            Description
                            <textarea
                                rows="5"
                                value={
                                    form.description
                                }
                                onChange={e =>
                                    update(
                                        "description",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </label>

                        <div className="modal-actions full">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={close}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={busy}
                            >
                                {busy
                                    ? "Saving..."
                                    : editing
                                    ? "Save Changes"
                                    : "Create Event"}
                            </button>

                        </div>

                    </form>

                    <div className="live-preview">

                        <span className="eyebrow">
                            LIVE PREVIEW
                        </span>

                        <div className="preview-card">

                            {form.image ? (
                                <img
                                    src={imageSource(
                                        form.image
                                    )}
                                    alt="Preview"
                                />
                            ) : (
                                <div className="preview-image">
                                    🎫
                                </div>
                            )}

                            <div className="preview-body">

                                <span className="category-tag">
                                    {form.category ||
                                        "Category"}
                                </span>

                                <h3>
                                    {form.name ||
                                        "Your Event Name"}
                                </h3>

                                <p>
                                    📍{" "}
                                    {form.city ||
                                        "City"}
                                    {form.venue
                                        ? ` · ${form.venue}`
                                        : ""}
                                </p>

                                <p>
                                    📅{" "}
                                    {form.date
                                        ? formatDate(
                                              form.date
                                          )
                                        : "Event date"}
                                </p>

                                {form.startTime && (
                                    <p>
                                        ⏰{" "}
                                        {
                                            form.startTime
                                        }
                                        {form.endTime
                                            ? ` – ${form.endTime}`
                                            : ""}
                                    </p>
                                )}

                                <div className="preview-footer">
                                    <strong>
                                        {money(
                                            form.price ||
                                                0
                                        )}
                                    </strong>

                                    <span>
                                        {form.totalSeats ||
                                            "—"}{" "}
                                        seats
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

function FormField({
    label,
    value,
    onChange,
    required
}) {
    return (
        <label>
            {label}

            <input
                required={required}
                value={value}
                onChange={e =>
                    onChange(
                        e.target.value
                    )
                }
            />
        </label>
    );
}

function EventDetailsModal({
    event,
    bookings,
    money,
    formatDate,
    close,
    edit,
    remove
}) {
    const [
        showSeats,
        setShowSeats
    ] = useState(false);

    const eventBookings =
        bookings.filter(
            booking =>
                booking.eventId ===
                    event._id ||
                booking.event?._id ===
                    event._id ||
                booking.eventName ===
                    eventNameOf(event)
        );

    const soldTickets = Number(
        event.soldTickets ??
            eventBookings.reduce(
                (sum, booking) =>
                    sum +
                    seatsOfBooking(
                        booking
                    ).length,
                0
            )
    );

    const totalSeats = Number(
        event.totalSeats || 0
    );

    const available = Math.max(
        totalSeats - soldTickets,
        0
    );

    const revenue =
        eventBookings.reduce(
            (sum, booking) =>
                sum +
                Number(
                    booking.amount || 0
                ),
            0
        );

    return (
        <div className="modal-backdrop">

            <div className="detail-modal">

                <div className="modal-header">

                    <div>
                        <span className="eyebrow">
                            EVENT DETAILS
                        </span>

                        <h2>
                            {eventNameOf(
                                event
                            )}
                        </h2>
                    </div>

                    <button
                        onClick={close}
                    >
                        ×
                    </button>

                </div>

                <div className="detail-hero">

                    {eventImageOf(
                        event
                    ) ? (
                        <img
                            src={imageSource(
                                eventImageOf(
                                    event
                                )
                            )}
                            alt={eventNameOf(
                                event
                            )}
                        />
                    ) : (
                        <div className="detail-placeholder">
                            🎫
                        </div>
                    )}

                    <div>

                        <Status
                            value={
                                event.status ||
                                "Approved"
                            }
                        />

                        <h3>
                            {eventNameOf(
                                event
                            )}
                        </h3>

                        <p>
                            {event.description ||
                                "No description provided."}
                        </p>

                        <div className="detail-meta">
                            <span>
                                📅{" "}
                                {formatDate(
                                    event.date
                                )}
                            </span>

                            <span>
                                📍{" "}
                                {eventCityOf(
                                    event
                                )}
                            </span>

                            <span>
                                ⏰{" "}
                                {event.startTime ||
                                    "—"}
                            </span>

                            <span>
                                💰{" "}
                                {money(
                                    eventPriceOf(
                                        event
                                    )
                                )}
                            </span>
                        </div>

                    </div>

                </div>

                <div className="detail-stats">

                    <DetailStat
                        label="Total Seats"
                        value={
                            totalSeats ||
                            "—"
                        }
                    />

                    <DetailStat
                        label="Sold Tickets"
                        value={
                            soldTickets
                        }
                    />

                    <DetailStat
                        label="Available Seats"
                        value={
                            available
                        }
                    />

                    <DetailStat
                        label="Revenue"
                        value={money(
                            revenue
                        )}
                    />

                </div>

                <button
                    className="seat-toggle"
                    onClick={() =>
                        setShowSeats(
                            value =>
                                !value
                        )
                    }
                >
                    <span>
                        <strong>
                            Available Seats
                        </strong>

                        <small>
                            {available} seats
                            currently available
                        </small>
                    </span>

                    <b>
                        {showSeats
                            ? "Hide"
                            : "View Seats"}{" "}
                        →
                    </b>
                </button>

                {showSeats && (
                    <div className="seat-section">

                        <h3>
                            Available /
                            Unbooked Seats
                        </h3>

                        {totalSeats ? (
                            <div className="seat-grid">
                                {Array.from(
                                    {
                                        length:
                                            Math.min(
                                                available,
                                                200
                                            )
                                    },
                                    (_, index) => (
                                        <span
                                            key={
                                                index
                                            }
                                        >
                                            Seat{" "}
                                            {index +
                                                1}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <p>
                                Seat capacity has
                                not been provided
                                for this event.
                            </p>
                        )}

                    </div>
                )}

                <div className="modal-actions">

                    <button
                        className="secondary-button"
                        onClick={close}
                    >
                        Close
                    </button>

                    <button
                        className="secondary-button"
                        onClick={edit}
                    >
                        Edit Event
                    </button>

                    <button
                        className="danger-button"
                        onClick={remove}
                    >
                        Delete Event
                    </button>

                </div>

            </div>

        </div>
    );
}

function RequestDetailsModal({
    request,
    money,
    formatDate,
    close,
    approve,
    reject,
    remove
}) {
    return (
        <div className="modal-backdrop">

            <div className="detail-modal">

                <div className="modal-header">

                    <div>
                        <span className="eyebrow">
                            REQUEST DETAILS
                        </span>

                        <h2>
                            {eventNameOf(
                                request
                            )}
                        </h2>
                    </div>

                    <button
                        onClick={close}
                    >
                        ×
                    </button>

                </div>

                <div className="request-detail">

                    {eventImageOf(
                        request
                    ) ? (
                        <img
                            src={imageSource(
                                eventImageOf(
                                    request
                                )
                            )}
                            alt={eventNameOf(
                                request
                            )}
                        />
                    ) : (
                        <div className="detail-placeholder">
                            📩
                        </div>
                    )}

                    <div>

                        <Status
                            value={
                                request.status
                            }
                        />

                        <h3>
                            {eventNameOf(
                                request
                            )}
                        </h3>

                        <p>
                            {request.description ||
                                "No description provided."}
                        </p>

                        <div className="detail-fields">

                            <span>
                                <b>Category</b>
                                {request.category ||
                                    "—"}
                            </span>

                            <span>
                                <b>Date</b>
                                {formatDate(
                                    request.date
                                )}
                            </span>

                            <span>
                                <b>Start Time</b>
                                {request.startTime ||
                                    "—"}
                            </span>

                            <span>
                                <b>End Time</b>
                                {request.endTime ||
                                    "—"}
                            </span>

                            <span>
                                <b>Venue</b>
                                {request.venue ||
                                    "—"}
                            </span>

                            <span>
                                <b>City</b>
                                {request.city ||
                                    request.location ||
                                    "—"}
                            </span>

                            <span>
                                <b>Address</b>
                                {request.address ||
                                    "—"}
                            </span>

                            <span>
                                <b>Ticket Price</b>
                                {money(
                                    request.ticketPrice ??
                                        request.price
                                )}
                            </span>

                            <span>
                                <b>Total Seats</b>
                                {request.totalSeats ||
                                    "—"}
                            </span>

                            <span>
                                <b>Organizer</b>
                                {request.organizerName ||
                                    "—"}
                            </span>

                            <span>
                                <b>Email</b>
                                {request.email ||
                                    "—"}
                            </span>

                            <span>
                                <b>Phone</b>
                                {request.phone ||
                                    "—"}
                            </span>

                        </div>

                    </div>

                </div>

                <div className="modal-actions">

                    <button
                        className="secondary-button"
                        onClick={close}
                    >
                        Close
                    </button>

                    {request.status ===
                        "Pending" && (
                        <>
                            <button
                                className="approve-button"
                                onClick={
                                    approve
                                }
                            >
                                ✓ Approve Request
                            </button>

                            <button
                                className="reject-button"
                                onClick={
                                    reject
                                }
                            >
                                ✕ Reject Request
                            </button>
                        </>
                    )}

                    <button
                        className="danger-button"
                        onClick={remove}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    note
}) {
    return (
        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div>
                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {note}
                </small>
            </div>

        </div>
    );
}

function StatusMetric({
    icon,
    label,
    value
}) {
    return (
        <div className="status-metric">

            <span>
                {icon}
            </span>

            <div>
                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>
            </div>

        </div>
    );
}

function SectionTitle({
    eyebrow,
    title,
    subtitle,
    action,
    onAction
}) {
    return (
        <div className="section-heading">

            <div>
                <span className="eyebrow">
                    {eyebrow}
                </span>

                <h2>
                    {title}
                </h2>

                {subtitle && (
                    <p>
                        {subtitle}
                    </p>
                )}
            </div>

            {action && (
                <button
                    className="section-link"
                    onClick={
                        onAction
                    }
                >
                    {action}
                </button>
            )}

        </div>
    );
}

function PageHeading({
    eyebrow,
    title,
    description
}) {
    return (
        <div className="page-heading">

            <div>
                <span className="eyebrow">
                    {eyebrow}
                </span>

                <h1>
                    {title}
                </h1>

                <p>
                    {description}
                </p>
            </div>

        </div>
    );
}

function Status({ value }) {
    const text =
        getStatus(value);

    return (
        <span
            className={`status-pill ${normalizeStatus(
                text
            )}`}
        >
            {text}
        </span>
    );
}

function DetailStat({
    label,
    value
}) {
    return (
        <div>
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
}

function EmptyState({
    text
}) {
    return (
        <div className="empty-state">
            {text}
        </div>
    );
}

export default AdminDashboard;