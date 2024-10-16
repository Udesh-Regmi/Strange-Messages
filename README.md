
# 🎭 Anonymous Message Sending App

![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🚀 Welcome to the Anonymous Message Sending App!

Discover a secure and engaging platform built with **Next.js**! Here, users can create accounts, share unique URLs, and receive anonymous feedback. Perfect for gathering genuine thoughts without revealing identities. 🤫

### 🌟 Explore the Live Demo
Check out our live application: [Anonymous Messages App](https://anonymous-message-next-js.vercel.app/)

---

## ✨ Features

- **🎭 Anonymous Messaging**: Send and receive messages while keeping your identity safe.
- **🔐 User Authentication**: Enjoy secure sign-up and login with **NextAuth.js**.
- **💅 Beautiful UI**: Modern, responsive design crafted with **Tailwind CSS** and **shadcn UI**.
- **🛡️ Secure Data Handling**: User data protection with **bcryptjs** for password hashing, managed via **MongoDB** and **Mongoose**.
- **✅ Form Validation**: Data integrity enforced with **Zod** for robust validation.
- **📧 Email Notifications**: Stay updated with notifications via **Resend API** for new messages.
- **🔍 TypeScript Support**: Benefit from enhanced development experience with full TypeScript integration.
- **🚀 Server-Side Rendering**: Optimal performance and SEO capabilities using **Next.js**.
- **🎨 Customizable UI Components**: Accessible and customizable components powered by **Radix UI**.
- **📱 Responsive Design**: Seamlessly works on both desktop and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (v14.2.14)
- **React** (v18+)
- **Tailwind CSS** (v3.4.1)
- **shadcn UI**
- **Embla Carousel**
- **Lucide React**

### Backend
- **NextAuth.js** (v4.24.8)
- **MongoDB** (v6.9.0)
- **Mongoose** (v8.7.0)
- **bcryptjs** (v2.4.3)
- **Zod** (v3.23.8)

### API Integration
- **Axios** (v1.7.7)
- **@google/generative-ai** (v0.21.0)

### Email
- **React Email** (v3.0.1)
- **Resend** (v4.0.0)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Udesh-Regmi/Anonymous_Message_NextJS.git
   cd Anonymous_Message_NextJS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   RESEND_API_KEY=your_resend_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the app in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action!

---



## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch**: 
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**: 
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**: 
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a pull request**

Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

---

## ⚠️ Known Issues

- **Resend API Email Verification**: There are some errors in getting the verification code to the user because the Resend API does not allow the use of public free domains for their email verification services. Other than that, the app is good to go!

---

## 🙏 Acknowledgements

A big thank you to the following technologies and platforms that made this project possible:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Resend](https://resend.com/)
- [Google AI](https://ai.google.dev/)

---

⭐ **Star this repo if you find it helpful!** Happy coding! 🚀

---

## 📞 Contact Me

I'm always open to connecting, collaborating, and hearing feedback! Feel free to reach out on any of the following platforms:

### 🌐 **Social Media**

- <a href="https://www.facebook.com/udesh.regmi.3"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="20" height="20"></a> **Facebook**: [Udesh Regmi](https://www.facebook.com/udesh.regmi.3)
- <a href="https://www.instagram.com/udeshregmi/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="20" height="20"></a> **Instagram**: [@udesh.regmi](https://www.instagram.com/udeshregmi/)
- <a href="https://www.linkedin.com/in/udesh-regmi/"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Linkedin_icon.svg" alt="LinkedIn" width="20" height="20"></a> **LinkedIn**: [Udesh Regmi](https://www.linkedin.com/in/udesh-regmi/)

---

### 💬 Let's Collaborate!

If you're interested in working on a project together or have any questions, feel free to reach out via direct message on any of these platforms.

---

**✨ Thanks for visiting!** ✨

---