"use client"

import { useParams } from "next/navigation"
import { Printer, Download, User, FileText } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

export default function InvoicePage() {

  const params = useParams()
  const id = params?.id as string

  const invoiceRef = useRef<HTMLDivElement>(null)

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [payAmount, setPayAmount] = useState(0)
  const [paymentMode, setPaymentMode] = useState("UPI")

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/bills/${id}`)
        const data = await res.json()

        setInvoice(data)

        const remaining =
          Number(data?.totalAmount || 0) -
          Number(data?.paidAmount || 0)

        setPayAmount(remaining)

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBill()
  }, [id])

  const handleDownload = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current)
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    pdf.addImage(imgData, "PNG", 0, 0, 210, 0)
    pdf.save(`invoice-${id}.pdf`)
  }

  const handlePayment = async () => {
    const res = await fetch("/api/bills/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        billId: id,
        amount: payAmount,
        paymentMode
      })
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Payment failed")
      return
    }

    toast.success("Payment Successful ✅")
    setInvoice(data.bill)

    setTimeout(() => {
      handleDownload()
    }, 500)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  if (!invoice) {
    return <div className="p-4 text-sm">Invoice not found</div>
  }

  const total = Number(invoice.totalAmount || 0)
  const paid = Number(invoice.paidAmount || 0)
  const remaining = total - paid

  return (

    <div className="space-y-5" ref={invoiceRef}>

      {/* HEADER */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border">

        <p className="text-lg font-semibold text-gray-900">
          Medicare Hospital
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Invoice ID: {invoice.id}
        </p>

      </div>

      {/* PATIENT + DOCTOR */}
      <div className="space-y-3">

        <div className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border flex items-center justify-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium">{invoice?.patient?.name}</p>
            <p className="text-gray-500 text-xs">{invoice?.patient?.phone}</p>
          </div>

        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border flex items-center justify-center">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium">{invoice?.doctor?.name}</p>
          </div>

        </div>

      </div>

      {/* BILL */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border flex justify-between items-center">

        <div className="flex items-center gap-2 text-sm">
          <FileText size={16} />
          {invoice.title}
        </div>

        <span className="font-semibold text-blue-600">
          ₹{total}
        </span>

      </div>

      {/* STATUS */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border text-sm space-y-2">

        <div className="flex justify-between">
          <span>Paid</span>
          <span>₹{paid}</span>
        </div>

        <div className="flex justify-between">
          <span>Remaining</span>
          <span>₹{remaining}</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <span className={
            invoice.status === "paid"
              ? "text-green-600"
              : invoice.status === "partial"
              ? "text-blue-600"
              : "text-yellow-600"
          }>
            {invoice.status}
          </span>
        </div>

      </div>

      {/* PAYMENT */}
      {invoice.status !== "paid" && (

        <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-3">

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full border p-2.5 rounded-xl text-sm"
          >
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>

          <input
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
            className="w-full border p-2.5 rounded-xl text-sm"
          />

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-xl text-sm"
          >
            Pay & Download
          </button>

        </div>

      )}

      {/* FLOAT BUTTONS */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-3">

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
        >
          <Printer size={14} /> Print
        </button>

        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
        >
          <Download size={14} /> PDF
        </button>

      </div>

    </div>
  )
}