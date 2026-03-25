"use client"

import { useState, useCallback } from "react"
import type {
  Room,
  WindowItem,
  DoorItem,
  ExteriorState,
  FoundationState,
  ProjectDetails,
} from "../types"
import {
  defaultRoom,
  defaultBathroomExtras,
  defaultKitchenExtras,
  defaultExteriorState,
  defaultFoundationState,
  defaultProjectDetails,
} from "../defaults"

export function useEstimateForm() {
  const [activeTab, setActiveTab] = useState("exterior")
  const [isSaved, setIsSaved] = useState(true)

  // Project Details
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(defaultProjectDetails)

  // Exterior State
  const [exterior, setExterior] = useState<ExteriorState>(defaultExteriorState)

  // Foundation State
  const [foundation, setFoundation] = useState<FoundationState>(defaultFoundationState)

  // Interior Rooms
  const [rooms, setRooms] = useState<Room[]>([])

  // Save handler
  const handleSave = useCallback(() => {
    setIsSaved(false)
    setTimeout(() => setIsSaved(true), 1000)
  }, [])

  // Project details update
  const updateProjectDetails = useCallback((updates: Partial<ProjectDetails>) => {
    setProjectDetails((prev) => ({ ...prev, ...updates }))
    handleSave()
  }, [handleSave])

  // Exterior update
  const updateExterior = useCallback(<K extends keyof ExteriorState>(
    key: K,
    value: ExteriorState[K]
  ) => {
    setExterior((prev) => ({ ...prev, [key]: value }))
    handleSave()
  }, [handleSave])

  // Foundation update
  const updateFoundation = useCallback(<K extends keyof FoundationState>(
    key: K,
    value: FoundationState[K]
  ) => {
    setFoundation((prev) => ({ ...prev, [key]: value }))
    handleSave()
  }, [handleSave])

  // Room handlers
  const addRoom = useCallback((type: string = "room", name: string = "") => {
    const existingCount = rooms.filter((r) => r.type === type).length + 1
    let roomName = name
    if (!roomName) {
      switch (type) {
        case "bathroom":
          roomName = `Bathroom ${existingCount}`
          break
        case "kitchen":
          roomName = `Kitchen ${existingCount}`
          break
        default:
          roomName = `Room ${rooms.filter((r) => r.type === "room").length + 1}`
      }
    }
    const newRoom: Room = {
      id: Date.now(),
      name: roomName,
      ...defaultRoom,
      type,
      ...(type === "bathroom" ? defaultBathroomExtras : {}),
      ...(type === "kitchen" ? defaultKitchenExtras : {}),
    }
    setRooms((prev) => [...prev, newRoom])
    handleSave()
  }, [rooms, handleSave])

  const copyRoom = useCallback((roomId: number) => {
    const roomToCopy = rooms.find((r) => r.id === roomId)
    if (roomToCopy) {
      const newRoom = {
        ...roomToCopy,
        id: Date.now(),
        name: `${roomToCopy.name} (Copy)`,
      }
      setRooms((prev) => [...prev, newRoom])
      handleSave()
    }
  }, [rooms, handleSave])

  const removeRoom = useCallback((roomId: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
    handleSave()
  }, [handleSave])

  const updateRoom = useCallback((roomId: number, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r)))
    handleSave()
  }, [handleSave])

  const addWindow = useCallback((roomId: number) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      const newWindow: WindowItem = {
        id: Date.now(),
        type: "",
        size: "",
        grade: "",
        casing: "",
        marbleSill: false,
      }
      updateRoom(roomId, { windows: [...room.windows, newWindow] })
    }
  }, [rooms, updateRoom])

  const addDoor = useCallback((roomId: number, category: "interior" | "exterior") => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      const newDoor: DoorItem = {
        id: Date.now(),
        category,
        type: "",
        grade: "",
        finish: "",
        handleAction: "",
        peepHole: false,
        mailSlot: false,
      }
      updateRoom(roomId, { doors: [...room.doors, newDoor] })
    }
  }, [rooms, updateRoom])

  return {
    // State
    activeTab,
    setActiveTab,
    isSaved,
    projectDetails,
    exterior,
    foundation,
    rooms,

    // Direct setters
    setProjectDetails,
    setExterior,
    setFoundation,

    // Actions
    handleSave,
    updateProjectDetails,
    updateExterior,
    updateFoundation,
    addRoom,
    copyRoom,
    duplicateRoom: copyRoom,
    removeRoom,
    updateRoom,
    addWindow,
    addDoor,
  }