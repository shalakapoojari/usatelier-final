"use client"

import { useEffect, useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts"
import {
    TrendingUp,
    Heart,
    ShoppingCart,
    AlertTriangle,
    Package,
    ArrowRight,
    RefreshCw,
} from "lucide-react"

interface AnalysisData {
    most_sold: any[]
    most_favorited: any[]
    most_added_to_cart: any[]
    low_stock: any[]
    all_stock: any[]
    category_stats: any[]
}

const COLORS = ["#e8e8e3", "#a1a1aa", "#71717a", "#52525b", "#3f3f46"]

export default function BusinessAnalysisPage() {
    const [API_BASE, setApiBase] = useState("")

    useEffect(() => {
        setApiBase(`http://${window.location.hostname}:5000`)
    }, [])

    const [data, setData] = useState<AnalysisData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        if (!API_BASE) return
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/admin/analysis`, {
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to fetch analysis data")
            const result = await res.json()
            setData(result)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (API_BASE) {
            fetchData()
        }
    }, [API_BASE])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-white/20" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Loading Analysis...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-400 mb-4 font-light tracking-widest uppercase text-xs">Error: {error}</p>
                <button
                    onClick={fetchData}
                    className="px-6 py-2 border border-white/20 text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl tracking-widest mb-2 uppercase text-[#e8e8e3]">Business Analysis</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-light">
                    Global performance and inventory insights
                </p>
            </div>

            {/* Grid for Top Stats Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Most Sold Products */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-sm overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-5 h-5 text-[#e8e8e3]" />
                        <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Top Performance (by Sales)</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.most_sold} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    stroke="#71717a"
                                    fontSize={10}
                                    tickFormatter={(val) => val.length > 20 ? `${val.substring(0, 17)}...` : val}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <Bar dataKey="total_sold" fill="#e8e8e3" radius={[0, 2, 2, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Most Added to Cart */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-sm overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <ShoppingCart className="w-5 h-5 text-[#e8e8e3]" />
                        <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Buyer Intent (Added to Cart)</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.most_added_to_cart} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    stroke="#71717a"
                                    fontSize={10}
                                    tickFormatter={(val) => val.length > 20 ? `${val.substring(0, 17)}...` : val}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                                <Bar dataKey="total_quantity" fill="#a1a1aa" radius={[0, 2, 2, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            </div>

            {/* Favorites & Categories Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Most Favorited */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-sm overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <Heart className="w-5 h-5 text-red-300" />
                        <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Wishlist Popularity</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.most_favorited}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#71717a"
                                    fontSize={8}
                                    tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 7)}...` : val}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                                <Bar dataKey="count" fill="rgba(252, 165, 165, 0.4)" stroke="rgba(252, 165, 165, 0.8)" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Category Stats */}
                <section className="bg-white/5 border border-white/10 p-8 rounded-sm overflow-hidden flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <Package className="w-5 h-5 text-[#e8e8e3]" />
                        <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Inventory Distribution</h2>
                    </div>
                    <div className="flex-1 flex items-center">
                        <div className="h-[250px] w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.category_stats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="_id"
                                    >
                                        {data.category_stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-4 px-6">
                            {data.category_stats.map((cat, idx) => (
                                <div key={cat._id} className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                        <span className="text-gray-400">{cat._id}</span>
                                    </div>
                                    <span className="text-[#e8e8e3]">{cat.count} Items</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            {/* Stock Alerts & Full Table */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Low Stock Alerts */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Critical Stock Alerts</h2>
                        </div>
                        <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded-sm uppercase tracking-widest">
                            {data.low_stock.length} Critical
                        </span>
                    </div>

                    <div className="space-y-4">
                        {data.low_stock.length > 0 ? (
                            data.low_stock.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-[#e8e8e3]">{item.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-amber-500">{item.stock} Remaining</p>
                                        <button className="text-[9px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors mt-1 flex items-center gap-1">
                                            Restock <ArrowRight className="w-2 h-2" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest py-8 text-center italic">No critical stock levels detected.</p>
                        )}
                    </div>
                </div>

                {/* Global Inventory List */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-sm flex flex-col max-h-[500px]">
                    <div className="flex items-center gap-3 mb-8">
                        <Package className="w-5 h-5 text-[#e8e8e3]" />
                        <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#e8e8e3]">Inventory Monitor</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                                    <th className="pb-4 font-light">Product</th>
                                    <th className="pb-4 font-light text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.all_stock.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4">
                                            <p className="text-xs uppercase tracking-widest text-[#e8e8e3]">{item.name}</p>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">{item.category}</p>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-xs ${item.stock <= 10 ? 'text-amber-400' : 'text-gray-400'}`}>
                                                {item.stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Aesthetic Footer Note */}
            <div className="pt-12 border-t border-white/5 flex justify-between items-center text-[9px] uppercase tracking-[0.4em] text-gray-700">
                <span>U.S ATELIER INTEL - AUTOMATED ANALYSIS</span>
                <span>LAST SYNC: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    )
}
