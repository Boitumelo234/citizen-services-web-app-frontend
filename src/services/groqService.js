const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || "";
const GROQ_MODEL = process.env.REACT_APP_GROQ_MODEL || "llama-3.3-70b-versatile";

function buildDashboardContext(dashboard = {}) {
    const categories = Array.isArray(dashboard.categories)
        ? dashboard.categories.map((item) => `${item.name}: ${item.count}`).join(", ")
        : "";

    const recentComplaints = Array.isArray(dashboard.recentComplaints)
        ? dashboard.recentComplaints
            .map((item) => {
                const parts = [
                    item.title || item.id || "Untitled complaint",
                    item.category || "Unknown category",
                    item.status || "Unknown status",
                    item.date || "Unknown date",
                ];
                return parts.join(" | ");
            })
            .join("\n")
        : "";

    return [
        `Citizen name: ${dashboard.citizenName || "Citizen"}`,
        `Total complaints: ${dashboard.totalComplaints || 0}`,
        `Resolved this month: ${dashboard.resolvedThisMonth || 0}`,
        `Unread notifications: ${dashboard.unreadNotifications || 0}`,
        `Categories: ${categories || "None"}`,
        `Recent complaints:\n${recentComplaints || "None"}`,
        `Current page: ${window.location.href}`,
        `Current local time: ${new Date().toString()}`,
    ].join("\n");
}

export async function askGroqCitizenAssist(message, dashboard) {
    if (!message || !message.trim()) {
        throw new Error("Message is required.");
    }

    if (!GROQ_API_KEY) {
        throw new Error("REACT_APP_GROQ_API_KEY is not set.");
    }

    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            temperature: 0.4,
            messages: [
                {
                    role: "system",
                    content: [
                        "You are Citizen AI Assist for a municipal citizen services dashboard.",
                        "Use the supplied dashboard context to answer questions about complaints, categories, notifications, and likely next steps.",
                        "Be concise, practical, and plain.",
                        "If the answer is not in the supplied context, say so clearly instead of making things up.",
                    ].join(" "),
                },
                {
                    role: "system",
                    content: `Dashboard context:\n${buildDashboardContext(dashboard)}`,
                },
                {
                    role: "user",
                    content: message.trim(),
                },
            ],
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const apiMessage = data?.error?.message || data?.message || `Groq request failed with status ${response.status}`;
        throw new Error(apiMessage);
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply || !String(reply).trim()) {
        throw new Error("Groq returned an empty response.");
    }

    return String(reply).trim();
}
