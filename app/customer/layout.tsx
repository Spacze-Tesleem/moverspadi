"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/application/store/authStore"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, role } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || role !== "customer") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, role, router])

  return <>{children}</>
}
