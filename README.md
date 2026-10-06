<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c7b0edec-4224-48f3-bba8-178c9fab1899

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Access from another device on your network

Start the project with `../start.sh` from the project root, then open
`http://<computer-lan-ip>:3000` on the other device. The frontend and backend
bind to all network interfaces, and API requests use the same hostname on port
8000. The backend's development CORS and host settings allow these requests.
Allow ports 3000 and 8000 through your computer's firewall if prompted. These
development settings should not be exposed to an untrusted network.
