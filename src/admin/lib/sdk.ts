import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "/",
  debug: false,
  auth: {
    type: "session",
  },
})
