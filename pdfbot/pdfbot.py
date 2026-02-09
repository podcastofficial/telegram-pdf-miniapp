import os
import shutil
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    MessageHandler, ContextTypes, filters
)
from pdf2image import convert_from_path
from PIL import Image
from PyPDF2 import PdfReader, PdfWriter

TOKEN = "8314554804:AAHQRs9e8FsSAY1yGj5zMT658KT8mJoQhSA"

BASE = "data"
os.makedirs(BASE, exist_ok=True)

# ================= START =================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("📄 PDF → Image", callback_data="pdf2img")],
        [InlineKeyboardButton("🖼 Image → PDF", callback_data="img2pdf")],
        [InlineKeyboardButton("🗜 Compress PDF", callback_data="compress")],
        [InlineKeyboardButton("🔗 Merge PDFs", callback_data="merge")],
        [InlineKeyboardButton("✂ Split PDF", callback_data="split")],
        [InlineKeyboardButton("🔒 Lock PDF", callback_data="lock")],
        [InlineKeyboardButton("🔓 Unlock PDF", callback_data="unlock")]
    ]
    await update.message.reply_text(
        "📂 **PDF Utility Bot**\nSelect an option 👇",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

# ================= BUTTON =================
async def button(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    context.user_data.clear()
    context.user_data["mode"] = q.data

    await q.message.reply_text(
        f"📥 Send file for **{q.data.upper()}**",
        parse_mode="Markdown"
    )

# ================= PDF HANDLER =================
async def pdf_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    mode = context.user_data.get("mode")
    file = update.message.document
    path = f"{BASE}/{file.file_id}.pdf"
    await (await file.get_file()).download_to_drive(path)

    # PDF → IMAGE
    if mode == "pdf2img":
        images = convert_from_path(path, dpi=200)
        for i, img in enumerate(images):
            img_path = f"{BASE}/{file.file_id}_{i}.jpg"
            img.save(img_path)
            await update.message.reply_photo(open(img_path, "rb"))
            os.remove(img_path)

    # SPLIT
    elif mode == "split":
        reader = PdfReader(path)
        for i, page in enumerate(reader.pages):
            writer = PdfWriter()
            writer.add_page(page)
            out = f"{BASE}/page_{i+1}.pdf"
            with open(out, "wb") as f:
                writer.write(f)
            await update.message.reply_document(open(out, "rb"))
            os.remove(out)

    # LOCK
    elif mode == "lock":
        context.user_data["pdf"] = path
        await update.message.reply_text("🔑 Send password")

    # UNLOCK
    elif mode == "unlock":
        context.user_data["pdf"] = path
        await update.message.reply_text("🔑 Send password")

    # COMPRESS
    elif mode == "compress":
        out = f"{BASE}/compressed.pdf"
        os.system(f"gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 "
                  f"-dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH "
                  f"-sOutputFile={out} {path}")
        await update.message.reply_document(open(out, "rb"))
        os.remove(out)

    context.user_data["last_pdf"] = path

# ================= IMAGE HANDLER =================
async def image_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.user_data.get("mode") != "img2pdf":
        return

    photos = update.message.photo
    img_path = f"{BASE}/{update.message.message_id}.jpg"
    await (await photos[-1].get_file()).download_to_drive(img_path)

    pdf_path = f"{BASE}/image.pdf"
    Image.open(img_path).convert("RGB").save(pdf_path)

    await update.message.reply_document(open(pdf_path, "rb"))
    os.remove(img_path)
    os.remove(pdf_path)

# ================= PASSWORD HANDLER =================
async def text_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    mode = context.user_data.get("mode")
    pdf = context.user_data.get("pdf")
    pwd = update.message.text

    reader = PdfReader(pdf)
    writer = PdfWriter()

    if mode == "unlock":
        reader.decrypt(pwd)
        for p in reader.pages:
            writer.add_page(p)

    if mode == "lock":
        for p in reader.pages:
            writer.add_page(p)
        writer.encrypt(pwd)

    out = f"{BASE}/secured.pdf"
    with open(out, "wb") as f:
        writer.write(f)

    await update.message.reply_document(open(out, "rb"))
    os.remove(out)

# ================= MAIN =================
def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button))
    app.add_handler(MessageHandler(filters.Document.PDF, pdf_handler))
    app.add_handler(MessageHandler(filters.PHOTO, image_handler))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_handler))

    print("✅ PDF Utility Bot Running (ALL FEATURES)")
    app.run_polling()

if __name__ == "__main__":
    main()
