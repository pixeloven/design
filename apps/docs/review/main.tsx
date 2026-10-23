import React from "react"
import { createRoot } from "react-dom/client"
import "@pixeloven/tokens/tokens.css"
import "@fontsource/ibm-plex-sans/latin-400.css"
import "@fontsource/ibm-plex-sans/latin-500.css"
import "@fontsource/ibm-plex-sans/latin-600.css"
import "@fontsource/ibm-plex-mono/latin-400.css"
import { WardenReview } from "../stories/WardenReview"

const root = document.getElementById("root")
if (!root) throw new Error("Review root is missing")
createRoot(root).render(<WardenReview />)
