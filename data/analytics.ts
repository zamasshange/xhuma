export const overviewStats = [
  { id: "views", label: "Profile Views", value: "48,290", change: 12.4, icon: "eye" },
  { id: "clicks", label: "Link Clicks", value: "21,847", change: 8.1, icon: "mouse-pointer-click" },
  { id: "followers", label: "Followers", value: "128,402", change: 3.6, icon: "users" },
  { id: "ctr", label: "Click-Through Rate", value: "45.2%", change: -1.2, icon: "trending-up" },
]

export const viewsSeries = [
  { date: "Mon", views: 4200, clicks: 1800 },
  { date: "Tue", views: 5100, clicks: 2300 },
  { date: "Wed", views: 4800, clicks: 2100 },
  { date: "Thu", views: 6400, clicks: 2900 },
  { date: "Fri", views: 7200, clicks: 3400 },
  { date: "Sat", views: 8900, clicks: 4100 },
  { date: "Sun", views: 8200, clicks: 3800 },
]

export const monthlyGrowth = [
  { month: "Jan", value: 18000 },
  { month: "Feb", value: 24000 },
  { month: "Mar", value: 31000 },
  { month: "Apr", value: 38000 },
  { month: "May", value: 52000 },
  { month: "Jun", value: 68000 },
]

export const topCountries = [
  { country: "United States", value: 38, flag: "US" },
  { country: "United Kingdom", value: 18, flag: "UK" },
  { country: "Germany", value: 14, flag: "DE" },
  { country: "Brazil", value: 11, flag: "BR" },
  { country: "Japan", value: 9, flag: "JP" },
  { country: "Other", value: 10, flag: "··" },
]

export const devices = [
  { name: "Mobile", value: 72, fill: "var(--color-chart-1)" },
  { name: "Desktop", value: 21, fill: "var(--color-chart-2)" },
  { name: "Tablet", value: 7, fill: "var(--color-chart-3)" },
]

export const topLinks = [
  { title: "Listen to my new EP", clicks: 4820, ctr: "9.9%" },
  { title: "Sample pack — Midnight Vol.2", clicks: 2310, ctr: "4.7%" },
  { title: "Book me for your event", clicks: 1290, ctr: "2.6%" },
  { title: "Behind the scenes on YouTube", clicks: 980, ctr: "2.0%" },
]

export const recentActivity = [
  { id: "1", text: "New follower from Los Angeles", time: "2m ago", icon: "user-plus" },
  { id: "2", text: "“Listen to my new EP” clicked 48 times", time: "14m ago", icon: "mouse-pointer-click" },
  { id: "3", text: "Profile shared on Instagram", time: "1h ago", icon: "share-2" },
  { id: "4", text: "AI generated a new bio variant", time: "3h ago", icon: "sparkles" },
  { id: "5", text: "Theme “Aurora” applied", time: "Yesterday", icon: "palette" },
]

// 7 cols x 7 rows heatmap intensity 0-4
export const heatmap = [
  [1, 2, 1, 3, 2, 4, 3],
  [2, 1, 2, 2, 3, 4, 4],
  [1, 1, 2, 3, 4, 3, 2],
  [0, 1, 1, 2, 3, 4, 3],
  [1, 2, 3, 4, 4, 2, 1],
  [2, 3, 2, 3, 3, 2, 4],
  [3, 2, 4, 3, 2, 3, 4],
]
