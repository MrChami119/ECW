"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/appointments")
      
      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }
      
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId, status }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update appointment")
      }
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId ? { ...apt, status } : apt
      ))
      
      if (selectedAppointment && selectedAppointment._id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status })
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.message && appointment.message.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return appointment.status === "pending" && matchesSearch
    if (activeTab === "confirmed") return appointment.status === "confirmed" && matchesSearch
    if (activeTab === "completed") return appointment.status === "completed" && matchesSearch
    if (activeTab === "cancelled") return appointment.status === "cancelled" && matchesSearch
    
    return matchesSearch
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>
      case "confirmed":
        return <Badge variant="outline" className="border-green-500 text-green-500">Confirmed</Badge>
      case "completed":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage customer appointments and consultations</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-8 border-primary/20 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>
                {activeTab === "all" ? "All Appointments" : 
                 activeTab === "pending" ? "Pending Appointments" : 
                 activeTab === "confirmed" ? "Confirmed Appointments" :
                 activeTab === "completed" ? "Completed Appointments" : "Cancelled Appointments"}
              </CardTitle>
              <CardDescription>
                {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading appointments...</div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-m\
