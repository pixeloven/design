import type { Meta, StoryObj } from "@storybook/react-vite"
import { WardenReview } from "./WardenReview"

const meta = { title: "Studies/Warden", component: WardenReview, parameters: { layout: "fullscreen" } } satisfies Meta<typeof WardenReview>
export default meta
type Story = StoryObj<typeof meta>
export const Workspace: Story = {}
export const Identity: Story = { args: { initialPage: "identity" } }
