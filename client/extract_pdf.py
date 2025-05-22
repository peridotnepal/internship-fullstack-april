# import fitz  # PyMuPDF
# import sys

# def extract_text_as_html_table(pdf_path):
#     doc = fitz.open(pdf_path)
#     html = "<table border='1' cellspacing='0' cellpadding='5'>"

#     for page in doc:
#         text = page.get_text("blocks")  # text blocks with position
#         for block in sorted(text, key=lambda b: (b[1], b[0])):  # sort by y, then x
#             line = block[4].strip()
#             if line:
#                 html += "<tr><td>" + "</td><td>".join(line.split()) + "</td></tr>"

#     html += "</table>"
#     print(html)

# if __name__ == "__main__":
#     pdf_path = sys.argv[1]
#     extract_text_as_html_table(pdf_path)

#To retrieve your document content in Markdown simply install the package and then use a couple of lines of Python code to get results.
import pymupdf4llm
md_text = pymupdf4llm.to_markdown("public/ishan.pdf")
# Save the markdown text to a file
import pathlib
pathlib.Path("output.md").write_bytes(md_text.encode())