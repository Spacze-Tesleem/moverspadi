"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/components/store/authStore"

export default function MoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, role } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || role !== "mover") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, role, router])

  return <>{children}</>
}
