# Fathima Amna Portfolio

Plain HTML, CSS and JavaScript. No build step.

## Run it
1. Open the `amna-portfolio` folder in VS Code (File > Open Folder).
2. Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**. (Double-clicking `index.html` also works.)

## Customize
- **Profile photo / project screenshots:** replace files in `images/` keeping the same names (`profile.jpg`, `wedding-portfolio.jpg`, `testng-portfolio.jpg`, `tshirt-portfolio.jpg`). Missing images are hidden instead of breaking the layout.
- **CV:** put your PDF at `assets/cv.pdf`, then in `index.html` change `data-cv-ready="false"` to `"true"` on the `#cv` link. Until then the button shows a friendly notice.
- **GitHub / LinkedIn:** search `index.html` for `YOUR-USERNAME` and replace each (hero, contact, footer, project buttons).
- **Email:** replace `your.email@example.com`.
- **Experience:** edit the `[placeholder]` entry or delete it. To hide the whole section, add `hidden` to `<section id="experience">` and remove its nav link.
- **Skills / certificates:** edit the list items in `index.html`.

## Make the contact form really send
The form validates input but sends nothing by default.
1. Create a free form at Formspree.io (or Web3Forms / EmailJS).
2. Copy its endpoint URL.
3. In `js/script.js`, set `const FORM_ENDPOINT = 'https://formspree.io/f/xxxx';`

## Notes
- Project details are in the modal (View Details). No project is claimed as deployed.
- Icons load from the Devicon CDN; labels still show offline.
