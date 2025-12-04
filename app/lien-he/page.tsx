"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Clock, AlertCircle, Send, CheckCircle2 } from "lucide-react"

export default function LienHePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    message?: string
  }>({})

  const [touched, setTouched] = useState<{
    name?: boolean
    email?: boolean
    message?: boolean
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateName = (value: string) => {
    if (!value.trim()) return "Tên không được để trống"
    if (value.length < 2) return "Tên phải có ít nhất 2 ký tự"
    return undefined
  }

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email không được để trống"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "Email không hợp lệ"
    return undefined
  }

  const validateMessage = (value: string) => {
    if (!value.trim()) return "Nội dung không được để trống"
    if (value.length < 10) return "Nội dung phải có ít nhất 10 ký tự"
    if (value.length > 1000) return "Nội dung không được vượt quá 1000 ký tự"
    return undefined
  }

  const handleFieldBlur = (field: keyof typeof touched) => {
    setTouched((t) => ({ ...t, [field]: true }))

    let error: string | undefined
    switch (field) {
      case "name":
        error = validateName(formData.name)
        break
      case "email":
        error = validateEmail(formData.email)
        break
      case "message":
        error = validateMessage(formData.message)
        break
    }

    setErrors((e) => ({ ...e, [field]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateMessage(formData.message),
    }

    setTouched({
      name: true,
      email: true,
      message: true,
    })

    setErrors(newErrors)

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== undefined)) {
      return
    }

    // Simulate form submission
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)

    console.log("Contact form submitted:", formData)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setTouched({})
      setErrors({})
      setSubmitSuccess(false)
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@aicomic.vn",
      href: "mailto:contact@aicomic.vn",
    },
    {
      icon: Phone,
      label: "Điện thoại",
      value: "+84 123 456 789",
      href: "tel:+84123456789",
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: "123 Đường ABC, Quận 1, TP.HCM",
      href: null,
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: "Thứ 2 - Thứ 6: 9:00 - 18:00",
      href: null,
    },
  ]

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Có câu hỏi hoặc góp ý? Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>

        {/* Split Layout: Contact Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Contact Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Thông tin liên hệ
              </h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center 
                        transition-colors duration-200 group-hover:bg-primary/20">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className={`text-base text-foreground ${item.href ? "group-hover:text-primary transition-colors duration-200" : ""}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )

                  if (item.href) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        className="block cursor-pointer"
                      >
                        {content}
                      </a>
                    )
                  }

                  return (
                    <div key={index}>
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
              <h3 className="text-base font-semibold text-foreground mb-3">
                Câu hỏi thường gặp
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Trước khi liên hệ, bạn có thể tham khảo trang Câu hỏi thường gặp 
                để tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-lg transition-colors duration-200 cursor-pointer 
                  border-primary/50 text-primary hover:bg-primary/10"
              >
                Xem câu hỏi thường gặp
              </Button>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Gửi tin nhắn
              </h2>

              {submitSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Gửi thành công!
                  </h3>
                  <p className="text-base text-muted-foreground max-w-md mx-auto">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Họ và tên <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (touched.name) {
                          setErrors((err) => ({ ...err, name: validateName(e.target.value) }))
                        }
                      }}
                      onBlur={() => handleFieldBlur("name")}
                      placeholder="Nhập họ và tên của bạn"
                      disabled={isSubmitting}
                      className={`rounded-lg border transition-colors duration-200 
                        ${touched.name && errors.name
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-primary focus:ring-primary"
                        }`}
                    />
                    {touched.name && errors.name && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (touched.email) {
                          setErrors((err) => ({ ...err, email: validateEmail(e.target.value) }))
                        }
                      }}
                      onBlur={() => handleFieldBlur("email")}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                      className={`rounded-lg border transition-colors duration-200 
                        ${touched.email && errors.email
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-primary focus:ring-primary"
                        }`}
                    />
                    {touched.email && errors.email && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-foreground">
                      Nội dung <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value })
                        if (touched.message) {
                          setErrors((err) => ({ ...err, message: validateMessage(e.target.value) }))
                        }
                      }}
                      onBlur={() => handleFieldBlur("message")}
                      placeholder="Nhập nội dung tin nhắn của bạn (ít nhất 10 ký tự)"
                      rows={6}
                      disabled={isSubmitting}
                      className={`rounded-lg border transition-colors duration-200 resize-none
                        ${touched.message && errors.message
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-primary focus:ring-primary"
                        }`}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tối thiểu 10 ký tự</span>
                      <span className={formData.message.length > 1000 ? "text-destructive" : ""}>
                        {formData.message.length}/1000
                      </span>
                    </div>
                    {touched.message && errors.message && (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground rounded-lg px-6 py-6 
                        text-base font-medium transition-colors duration-200 cursor-pointer 
                        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground 
                            rounded-full animate-spin mr-2" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
