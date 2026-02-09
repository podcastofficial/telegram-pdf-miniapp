import os
import img2pdf
from pdf2image import convert_from_path
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import subprocess

TEMP = "temp"
os.makedirs(TEMP, exist_ok=True)

# PDF → IMAGE
def pdf_to_images(pdf_path):
    images = convert_from_path(pdf_path)
    paths = []
    for i, img in enumerate(images):
        out = f"{TEMP}/page_{i+1}.jpg"
        img.save(out, "JPEG")
        paths.append(out)
    return paths

# IMAGE → PDF
def images_to_pdf(image_paths, out):
    with open(out, "wb") as f:
        f.write(img2pdf.convert(image_paths))
    return out

# PDF MERGE
def merge_pdfs(files, out):
    writer = PdfWriter()
    for f in files:
        reader = PdfReader(f)
        for page in reader.pages:
            writer.add_page(page)
    with open(out, "wb") as f:
        writer.write(f)
    return out

# PDF SPLIT
def split_pdf(pdf):
    reader = PdfReader(pdf)
    outputs = []
    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        out = f"{TEMP}/split_{i+1}.pdf"
        with open(out, "wb") as f:
            writer.write(f)
        outputs.append(out)
    return outputs

# PDF PASSWORD ADD
def lock_pdf(pdf, password, out):
    reader = PdfReader(pdf)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(password)
    with open(out, "wb") as f:
        writer.write(f)
    return out

# PDF PASSWORD REMOVE
def unlock_pdf(pdf, password, out):
    reader = PdfReader(pdf)
    if reader.is_encrypted:
        reader.decrypt(password)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    with open(out, "wb") as f:
        writer.write(f)
    return out

# PDF COMPRESS
def compress_pdf(inp, out):
    subprocess.run([
        "gs","-sDEVICE=pdfwrite","-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook","-dNOPAUSE","-dQUIET","-dBATCH",
        f"-sOutputFile={out}", inp
    ])
    return out

# PDF → WORD
def pdf_to_word(pdf, out):
    subprocess.run([
        "libreoffice","--headless","--convert-to","docx",
        pdf,"--outdir",TEMP
    ])
    return f"{TEMP}/{os.path.splitext(os.path.basename(pdf))[0]}.docx"
