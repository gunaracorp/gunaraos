# -*- coding: utf-8 -*-
"""Generator PDF: ROADMAP 99 LANGKAH GUNARA OS — MENUJU ACUAN DUNIA.
Route: Report (ReportLab) + cover Template 07 Crystal Blue (html2poster.js, digabung via pypdf).
Palet body = palet fix Template 07 (typesetting/cover.md) — satu keluarga hue biru ~215°."""
import os
import sys
import hashlib

PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, "scripts"))
sys.path.insert(0, "/home/z/my-project/scripts")

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, CondPageBreak,
                                KeepTogether)
from reportlab.platypus.tableofcontents import TableOfContents

from roadmap99_data import PHASES, TIMELINE, KPI, RISKS, BRANDS

# ── Font (hanya font terdaftar yang diizinkan) ─────────────────────────────
FONT_DIR = "/usr/share/fonts"
pdfmetrics.registerFont(TTFont("NotoSerifSC", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf"))
pdfmetrics.registerFont(TTFont("NotoSerifSC-Bold", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif", f"{FONT_DIR}/truetype/freefont/FreeSerif.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Bold", f"{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Italic", f"{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-BoldItalic", f"{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf"))
registerFontFamily("NotoSerifSC", normal="NotoSerifSC", bold="NotoSerifSC-Bold")
registerFontFamily("FreeSerif", normal="FreeSerif", bold="FreeSerif-Bold",
                   italic="FreeSerif-Italic", boldItalic="FreeSerif-BoldItalic")

from pdf import install_font_fallback  # noqa: E402
install_font_fallback()

# ── Palet fix Template 07 Crystal Blue (typesetting/cover.md, subset body) ─
PAGE_BG      = colors.HexColor("#f5f8fc")   # XL
SECTION_BG   = colors.HexColor("#edf2f9")   # XL
CARD_BG      = colors.HexColor("#e4ecf5")   # L
TABLE_STRIPE = colors.HexColor("#eef3fa")   # L
HEADER_FILL  = colors.HexColor("#1a4a7a")   # M
BORDER       = colors.HexColor("#c0d0e2")   # S
ACCENT       = colors.HexColor("#2d7ab3")   # XS
TEXT_PRIMARY = colors.HexColor("#142840")
TEXT_MUTED   = colors.HexColor("#5a7a96")

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_ROW_EVEN = colors.white
TABLE_ROW_ODD = TABLE_STRIPE

# ── Geometri halaman (margin simetris) ─────────────────────────────────────
MARGIN = 0.9 * inch
PAGE_W, PAGE_H = A4
AVAIL_W = PAGE_W - 2 * MARGIN
AVAIL_H = PAGE_H - 2 * MARGIN
H1_THRESHOLD = AVAIL_H * 0.25
MAX_KEEP_HEIGHT = PAGE_H * 0.4

DOC_TITLE = "Roadmap 99 Langkah Gunara OS — Menuju Acuan Dunia"
HEADER_TEXT = "ROADMAP 99 LANGKAH · GUNARA OS MENUJU ACUAN DUNIA"
FOOTER_LEFT = "Gunara OS · by Gugun Gunara — Muhammad Lutfi Azmi"

BODY_PDF = "/home/z/my-project/scripts/roadmap99_body.pdf"
COVER_PDF = "/home/z/my-project/scripts/roadmap99_cover.pdf"
FINAL_PDF = "/home/z/my-project/download/ROADMAP-GUNARA-OS-99-LANGKAH.pdf"

# ── Gaya ───────────────────────────────────────────────────────────────────
S_H1 = ParagraphStyle("H1", fontName="FreeSerif", fontSize=22, leading=27,
                      textColor=HEADER_FILL, spaceBefore=18, spaceAfter=10)
S_H2 = ParagraphStyle("H2", fontName="FreeSerif", fontSize=15, leading=20,
                      textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=8)
S_BODY = ParagraphStyle("Body", fontName="FreeSerif", fontSize=10.5, leading=17,
                        textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
                        spaceBefore=0, spaceAfter=10)
S_LIST = ParagraphStyle("List", parent=S_BODY, alignment=TA_LEFT,
                        leftIndent=18, firstLineIndent=0, spaceAfter=6)
S_CAPTION = ParagraphStyle("Caption", fontName="FreeSerif", fontSize=8.5,
                           leading=12, textColor=TEXT_MUTED, alignment=TA_CENTER,
                           spaceBefore=3, spaceAfter=6)
S_TH = ParagraphStyle("TH", fontName="FreeSerif", fontSize=9, leading=12,
                      textColor=colors.white, alignment=TA_CENTER)
S_TD = ParagraphStyle("TD", fontName="FreeSerif", fontSize=8.8, leading=12.5,
                      textColor=TEXT_PRIMARY, alignment=TA_LEFT)
S_TDC = ParagraphStyle("TDC", parent=S_TD, alignment=TA_CENTER)
S_STAT = ParagraphStyle("Stat", fontName="FreeSerif", fontSize=22, leading=26,
                        textColor=ACCENT, alignment=TA_CENTER)
S_STAT_LBL = ParagraphStyle("StatLbl", fontName="FreeSerif", fontSize=8.5,
                            leading=11, textColor=TEXT_MUTED, alignment=TA_CENTER)
S_TOC_TITLE = ParagraphStyle("TocTitle", fontName="FreeSerif", fontSize=20,
                             leading=25, textColor=HEADER_FILL, spaceAfter=14)

# ── Kerangka dokumen: TOC + nomor halaman romawi/arab ─────────────────────
ROMAN = {1: "i", 2: "ii", 3: "iii", 4: "iv", 5: "v", 6: "vi", 7: "vii",
         8: "viii", 9: "ix", 10: "x"}


class BodyStartMarker(Spacer):
    """Penanda nol-tinggi: halaman tempat konten utama mulai (nomor arab reset 1)."""
    def __init__(self):
        super().__init__(0, 0)


class TocDoc(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, BodyStartMarker):
            self._body_start = self.page
        if hasattr(flowable, "bookmark_name"):
            level = getattr(flowable, "bookmark_level", 0)
            text = getattr(flowable, "bookmark_text", "")
            key = getattr(flowable, "bookmark_key", "")
            start = getattr(self, "_body_start", self.page)
            display = self.page - start + 1 if self.page >= start else self.page
            self.notify("TOCEntry", (level, text, display, key))


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAGE_BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # header
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("FreeSerif", 7.5)
    canvas.drawString(MARGIN, PAGE_H - MARGIN + 24, HEADER_TEXT)
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.2)
    canvas.line(MARGIN, PAGE_H - MARGIN + 16, PAGE_W - MARGIN, PAGE_H - MARGIN + 16)
    # footer
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, MARGIN - 18, PAGE_W - MARGIN, MARGIN - 18)
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("FreeSerif", 7.5)
    canvas.drawString(MARGIN, MARGIN - 32, FOOTER_LEFT)
    canvas.setFont("FreeSerif", 9)
    start = getattr(doc, "_body_start", None)
    if start is None or doc.page < start:
        num = ROMAN.get(doc.page, str(doc.page))
    else:
        num = str(doc.page - start + 1)
    canvas.drawRightString(PAGE_W - MARGIN, MARGIN - 32, num)
    canvas.restoreState()


# ── Pembantu ───────────────────────────────────────────────────────────────
def safe_keep_together(elements):
    total_h = 0
    for el in elements:
        w, h = el.wrap(AVAIL_W, AVAIL_H)
        total_h += h
    if total_h <= MAX_KEEP_HEIGHT:
        return [KeepTogether(elements)]
    if len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)


def heading(text, style, level=0):
    key = "h_%s" % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/><b>%s</b>' % (key, text), style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p


def h1_block(text, first_para_text):
    """H1 dengan garis aksen + paragraf pertama terikat (anti-yatim)."""
    h = heading(text, S_H1)
    rule = Table([[""]], colWidths=[AVAIL_W], rowHeights=[2])
    rule.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 1.2, ACCENT),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    first = Paragraph(first_para_text, S_BODY)
    return [CondPageBreak(H1_THRESHOLD)] + safe_keep_together([h, rule, first])


def make_table(header, rows, ratios, center_cols=()):
    assert abs(sum(ratios) - 1.0) < 1e-6, "rasio kolom harus berjumlah 1.0"
    col_widths = [r * AVAIL_W for r in ratios]
    assert sum(col_widths) <= AVAIL_W + 0.5, "lebar tabel melebihi area"
    data = [[Paragraph("<b>%s</b>" % c, S_TH) for c in header]]
    for row in rows:
        cells = []
        for i, c in enumerate(row):
            st = S_TDC if i in center_cols else S_TD
            cells.append(Paragraph(str(c), st))
        data.append(cells)
    t = Table(data, colWidths=col_widths, hAlign="CENTER", repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(data)):
        style.append(("BACKGROUND", (0, i), (-1, i),
                      TABLE_ROW_ODD if i % 2 == 1 else TABLE_ROW_EVEN))
    t.setStyle(TableStyle(style))
    return t


def stat_callouts(stats):
    gap = 10
    box_w = (AVAIL_W - 3 * gap) / 4.0
    row_stat, row_lbl, widths = [], [], []
    for i, (num, lbl) in enumerate(stats):
        row_stat.append(Paragraph("<b>%s</b>" % num, S_STAT))
        row_lbl.append(Paragraph(lbl, S_STAT_LBL))
        widths.append(box_w)
        if i < 3:
            row_stat.append(Paragraph("", S_STAT_LBL))
            row_lbl.append(Paragraph("", S_STAT_LBL))
            widths.append(gap)
    t = Table([row_stat, row_lbl], colWidths=widths, hAlign="CENTER")
    style = [("VALIGN", (0, 0), (-1, -1), "MIDDLE")]
    for col in (0, 2, 4, 6):
        style += [
            ("BACKGROUND", (col, 0), (col, 1), CARD_BG),
            ("BOX", (col, 0), (col, 1), 1, ACCENT),
            ("TOPPADDING", (col, 0), (col, 0), 10),
            ("BOTTOMPADDING", (col, 1), (col, 1), 10),
        ]
    for col in (1, 3, 5):
        style += [
            ("LEFTPADDING", (col, 0), (col, -1), 0),
            ("RIGHTPADDING", (col, 0), (col, -1), 0),
        ]
    t.setStyle(TableStyle(style))
    return t


# ── Susunan cerita ─────────────────────────────────────────────────────────
story = []

story.append(Paragraph("<b>Daftar Isi</b>", S_TOC_TITLE))
toc = TableOfContents()
toc.dotsMinLevel = 0
toc.levelStyles = [
    ParagraphStyle("TOC0", fontName="FreeSerif", fontSize=10.5, leading=17,
                   leftIndent=16, firstLineIndent=-16, textColor=TEXT_PRIMARY),
]
story.append(toc)
story.append(PageBreak())
story.append(BodyStartMarker())

# ═══ BAB 1 — MANIFEST & VISI ═══
story += h1_block(
    "Bab 1 · Manifest dan Visi",
    "Dokumen ini adalah peta jalan resmi Gunara OS menuju satu tujuan yang dinyatakan "
    "tertulis sejak hari pertama: menjadi acuan dunia sebagai sistem operasi kehidupan dan "
    "bisnis terbaik yang pernah dibangun. Roadmap 99 langkah ini disusun dengan kerangka "
    "berpikir seolah digawangi gabungan empat puluh enam dewan pakar lintas bidang, dengan "
    "kedalaman pengalaman yang setara satu setengah abad per bidang, lalu ditarik menjadi "
    "sebelas fase bertahap yang setiap fase menutup satu rilis mayor bertag. Seluruh "
    "langkah berakar pada kondisi nyata sistem hari ini, bukan pada cita-cita yang melayang: "
    "setiap angka yang disebut dapat diperiksa di dalam repositori dan basis data yang hidup.")
story.append(Paragraph(
    "Prinsip penuntun perjalanan ini diambil dari satu kata yang diamanahkan sejak awal: "
    "amanah. Amanah kepada data pengguna, amanah kepada angka keuangan, amanah kepada "
    "janji yang ditulis dalam piagam, dan amanah kepada dunia yang kelak akan mengutip "
    "sistem ini. Karena itu bukan kebetulan bila fase keuangan, keamanan, dan audit "
    "menempati porsi besar dalam roadmap. Sistem terbaik di dunia bukanlah sistem yang "
    "paling banyak fitur, melainkan sistem yang paling bisa dipercaya ketika semuanya "
    "bergantung padanya.", S_BODY))
story.append(Paragraph(
    "Perjalanan 99 langkah diukur dalam jendela waktu Kuartal IV 2026 sampai Kuartal IV "
    "2028. Ritme yang dipilih sengaja lapang namun tak berkompromi: satu fase dituntaskan "
    "sebelum fase berikutnya dibuka, dan setiap fase diakhiri satu rilis publik yang "
    "dapat diperiksa siapa pun di GitHub. Kejujuran kemajuan adalah bagian dari produk: "
    "roadmap ini akan dipublikasikan, diperbarui lewat changelog otomatis, dan diuji "
    "kembali oleh Dewan 46 di setiap gerbang fase.", S_BODY))
story.append(Spacer(1, 8))
story.append(stat_callouts([
    ("99", "Langkah strategis"),
    ("11", "Fase bertahap"),
    ("44+", "Tabel data hidup"),
    ("219", "Baris data nyata"),
]))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>1.1 Titik Berangkat Hari Ini</b>", S_H2))
story.append(Paragraph(
    "Roadmap ini tidak dimulai dari kertas kosong. Gunara OS saat ini berdiri pada versi "
    "10.2.0 dengan nama sandi PUSAT-DATA: Prisma 7.10.1 dengan arsitektur basis data "
    "ganda yang bisa berpindah antara SQLite lokal dan Prisma Postgres cloud tanpa "
    "mengubah satu baris kode aplikasi. Di dalamnya sudah hidup 49 domain pengetahuan, "
    "15 agen pintar, fitur debat Dewan 46, modul keuangan hutang-piutang dan arus kas, "
    "rangkaian SEO, modul konsultasi, vault merek dengan enam kanal sosial resmi, serta "
    "45 dokumen register USAHASIAP yang siap diangkat menjadi produk. Seluruh kode "
    "tersimpan di GitHub organisasi gunaracorp dengan sistem versi semantik dan changelog "
    "yang tertata. Titik berangkat seperti ini jarang dimiliki sebuah proyek pada awal "
    "perjalanannya, dan itulah alasan roadmap ini bisa agresif namun realistis.", S_BODY))

story.append(Paragraph("<b>1.2 Enam Prinsip Amanah</b>", S_H2))
for i, p in enumerate([
    "Data tidak pernah bohong: setiap angka yang ditampilkan sistem harus dapat ditelusuri "
    "kembali ke rekaman aslinya.",
    "Keamanan lebih dulu daripada kenyamanan: benteng dibangun sebelum diserang, bukan "
    "setelah insiden terjadi.",
    "Kepatuhan adalah fondasi, bukan penghalang: legalitas dijadikan pintu masuk pendapatan "
    "lewat metodologi compliance to revenue.",
    "Keindahan adalah disiplin: antarmuka yang rapi mencerminkan mesin yang tertata di "
    "baliknya.",
    "Komunitas adalah tujuan: sistem diperkaya bersama, bukan dipagari sendirian.",
    "Suksesi lebih penting daripada sejarah: sistem harus bertahan melebihi usia "
    "penciptanya.",
], 1):
    story.append(Paragraph("%d. %s" % (i, p), S_LIST))

# ═══ BAB 2 — METODOLOGI ═══
story += h1_block(
    "Bab 2 · Metodologi dan Kerangka",
    "Roadmap 99 langkah disusun dengan struktur sebelas kali sembilan: sebelas fase, "
    "masing-masing berisi tepat sembilan langkah, dan langkah kesembilan setiap fase selalu "
    "satu rilis publik yang menutup fase tersebut secara sah. Struktur ini bukan angka "
    "kesukaan, melainkan alat kendali ritme: sembilan langkah cukup kecil untuk dieksekusi "
    "dalam satu kuartal, cukup besar untuk mengubah wajah sistem, dan cukup tetap untuk "
    "membuat kemajuan antarfase dapat dibandingkan secara adil. Susunan seperti ini juga "
    "membuat roadmap mudah diaudit: siapa pun dapat menghitung langkah yang sudah ditutup "
    "tanpa perlu menafsirkan arti kemajuan.")
story.append(Paragraph(
    "Setiap langkah di dalam tabel fase dirumuskan dalam empat bidang yang saling mengunci. "
    "Bidang aksi strategis menyatakan pekerjaan inti dalam satu kalimat utuh. Bidang output "
    "utama menyebut artefak nyata yang wajib muncul, dari dokumen hingga modul yang berjalan. "
    "Bidang indikator selesai memakai ukuran yang bisa diverifikasi orang ketiga, seperti "
    "latensi, skor, jumlah baris, atau keberadaan sertifikat. Dengan pola aksi-output-"
    "indikator, tidak ada langkah yang bisa dinyatakan selesai hanya karena merasa selesai: "
    "yang mengatakan selesai adalah buktinya, bukan perasaannya.", S_BODY))
story.append(Paragraph(
    "Urutan sebelas fase juga disusun sebagai tangga dependensi. Fondasi tata kelola "
    "didahulukan karena semua fase berikutnya menumpang di atas standar mutu; pusat data "
    "didahulukan sebelum kecerdasan, karena kecerdasan tanpa data yang bersih hanya akan "
    "mempercepat kesalahan; produk USAHASIAP didahulukan sebelum pengalaman pengguna yang "
    "mewah, karena kelangsungan hidup ekonomi lebih mendasar daripada kosmetik; dan "
    "legitimasi global ditempatkan hampir di akhir, karena sertifikasi dunia menguji "
    "kematangan yang tidak bisa dipalsukan di awal jalan. Membaca roadmap ini berarti "
    "membaca sebuah argumen: mengapa langkah ini sebelum langkah itu.", S_BODY))

# ═══ BAB 3 — PETA FASE ═══
story += h1_block(
    "Bab 3 · Peta Sebelas Fase",
    "Tabel berikut merangkum keseluruhan perjalanan: sebelas fase, cakupan langkahnya, "
    "jendela waktu, dan rilis mayor yang menutup setiap fase. Rincian sembilan langkah "
    "setiap fase diuraikan pada Bab 4 sampai Bab 14, dan garis waktu kuartalan lengkap "
    "tersaji pada Bab 15.")
overview_rows = [
    (str(p["no"]),
     "%d — %s: %s" % (p["no"], p["codename"], p["name"]),
     p["range"], p["window"], p["release"])
    for p in PHASES
]
t_overview = make_table(
    ["Fase", "Nama Fase dan Nama Sandi", "Cakupan", "Jendela Waktu", "Rilis"],
    overview_rows, [0.08, 0.40, 0.16, 0.21, 0.15], center_cols=(0, 2, 3, 4))
story.append(Spacer(1, 8))
story.append(t_overview)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabel 1. Peta sebelas fase roadmap 99 langkah Gunara OS.", S_CAPTION))
story.append(Spacer(1, 8))

# ═══ BAB 4–14 — 11 FASE ═══
for idx, p in enumerate(PHASES):
    bab = 4 + idx
    story += h1_block(
        "Bab %d · Fase %d — %s: %s" % (bab, p["no"], p["codename"], p["name"]),
        p["narrative"] + " Jendela pelaksanaannya adalah %s, dan fase ini ditutup "
        "dengan rilis %s %s." % (p["window"], p["release"], p["codename"]))
    rows = [(str(n), aksi, out, ind) for (n, aksi, out, ind) in p["steps"]]
    t = make_table(["No.", "Aksi Strategis", "Output Utama", "Indikator Selesai"],
                   rows, [0.07, 0.42, 0.25, 0.26], center_cols=(0,))
    story.append(Spacer(1, 8))
    story.append(t)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Tabel %d. Sembilan langkah Fase %d — %s (%s)." %
        (idx + 2, p["no"], p["codename"], p["range"]), S_CAPTION))
    story.append(Spacer(1, 8))

# ═══ BAB 15 — TIMELINE, TATA KELOLA, KPI ═══
story += h1_block(
    "Bab 15 · Garis Waktu, Tata Kelola, dan Indikator Kinerja",
    "Garis waktu di bawah ini membagi 99 langkah ke dalam sebelas jendela kuartalan dari "
    "Kuartal IV 2026 sampai Kuartal IV 2028. Tata kelola pelaksanaannya memakai tiga "
    "ritual yang tidak boleh bolong: rapat pembuka fase untuk meratifikasi ruang lingkup, "
    "tinjauan tengah fase oleh Dewan 46 untuk menguji arah, dan gerbang penutupan fase "
    "yang memeriksa seluruh indikator sebelum tag rilis dipacu. Setiap gerbang menghasilkan "
    "catatan putusan yang disimpan sebagai log keputusan, sehingga lima tahun kemudian "
    "siapa pun dapat membaca mengapa sebuah keputusan diambil dan apa yang dikorbankan "
    "saat itu.")
t_tl = make_table(["Jendela Waktu", "Fase", "Fokus Utama"],
                  TIMELINE, [0.22, 0.32, 0.46])
story.append(Spacer(1, 8))
story.append(t_tl)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabel 13. Garis waktu kuartalan sebelas fase, 2026 sampai 2028.", S_CAPTION))
story.append(Spacer(1, 10))
story.append(Paragraph("<b>15.1 Indikator Kinerja Utama</b>", S_H2))
story.append(Paragraph(
    "Enam indikator di bawah ini dipantau berkelanjutan dan dilaporkan pada setiap "
    "tinjauan kuartalan. Indikator sengaja dibuat sedikit namun tajam, karena indikator "
    "yang terlalu banyak sama artinya dengan tidak ada indikator: setiap angka harus "
    "memiliki pemilik, jadwal pengukuran, dan konsekuensi yang jelas bila meleset. Bila "
    "suatu indikator merah dua kuartal berturut-turut, fase berikutnya tidak boleh dibuka "
    "sebelum akar masalahnya ditangani.", S_BODY))
t_kpi = make_table(["Indikator", "Definisi dan Cara Ukur", "Target Akhir 2028"],
                   KPI, [0.20, 0.46, 0.34])
story.append(Spacer(1, 8))
story.append(t_kpi)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabel 14. Indikator kinerja utama perjalanan 99 langkah.", S_CAPTION))

# ═══ BAB 16 — RISIKO & MITIGASI ═══
story += h1_block(
    "Bab 16 · Risiko dan Mitigasi",
    "Roadmap yang jujur menyebut risikonya sebelum risiko menyebut dirinya. Tujuh risiko "
    "berikut adalah yang paling mungkin menggeser garis waktu atau merusak kepercayaan "
    "terhadap sistem, dan setiap risiko sudah dipasangkan dengan mitigasi yang merujuk "
    "langkah spesifik di dalam roadmap ini. Daftar ini diperbarui pada setiap gerbang "
    "fase: risiko yang terwujud dicatat sebagai pelajaran, risiko baru yang muncul "
    "ditambahkan, dan peringkatnya diurutkan ulang berdasarkan dampak serta kemungkinan.")
t_risk = make_table(["Risiko", "Dampak Bila Terjadi", "Mitigasi (merujuk langkah)"],
                    RISKS, [0.26, 0.34, 0.40])
story.append(Spacer(1, 8))
story.append(t_risk)
story.append(Spacer(1, 6))
story.append(Paragraph("Tabel 15. Register risiko utama dan mitigasinya.", S_CAPTION))

# ═══ BAB 17 — DEKLARASI ═══
story += h1_block(
    "Bab 17 · Deklarasi",
    "Roadmap 99 langkah ini dinyatakan sebagai dokumen perencanaan resmi Gunara OS dan "
    "menjadi acuan tunggal urutan pekerjaan dari v11.0.0 sampai v100.0.0. Ia diratifikasi "
    "oleh penggagas sistem, diawasi kemajuannya oleh Dewan 46 pada setiap gerbang fase, "
    "dan dipublikasikan kepada komunitas sebagai janji yang dipegang terbuka. Perubahan "
    "terhadap isi roadmap hanya sah melalui log keputusan dengan alasan tertulis, karena "
    " nilai sebuah peta jalan justru terletak pada kesungguhannya untuk tidak berganti "
    "arah setiap kali jalan mulai menanjak. Angka-angka di dalamnya adalah target kerja, "
    "bukan klaim pencapaian; setiap target akan diisi bukti ketika waktunya tiba.")
story.append(Paragraph(
    "Pada hari langkah kesembilan puluh sembilan ditutup, dunia tidak hanya menyaksikan "
    "satu perangkat lunak selesai, melainkan sebuah bukti bahwa sistem yang amanah, "
    "terdokumentasi, teraudit, dan digawangi komunitas dapat lahir dari niat yang "
    "ditulis dengan jelas dan dijalankan dengan disiplin. Sampai hari itu, setiap kuartal "
    "punya tugasnya, setiap langkah punya buktinya, dan setiap rilis punya namanya. "
    "Inilah jalan Gunara OS menuju acuan dunia: sebelas fase, sembilan puluh sembilan "
    "langkah, satu amanah.", S_BODY))

# ── Bangun body PDF ────────────────────────────────────────────────────────
doc = TocDoc(
    BODY_PDF, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN + 6, bottomMargin=MARGIN + 8,
    title=DOC_TITLE, author="Z.ai", creator="Z.ai",
    subject="Roadmap strategis 99 langkah Gunara OS menuju acuan dunia",
)
doc.multiBuild(story, onFirstPage=on_page, onLaterPages=on_page)
print("body selesai:", BODY_PDF)

# ── Gabungkan sampul + body menjadi satu PDF final ─────────────────────────
from pypdf import PdfReader, PdfWriter  # noqa: E402

A4_W, A4_H = 595.28, 841.89


def normalize(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    if abs(w - A4_W) > 0.1 or abs(h - A4_H) > 0.1:
        page.scale_to(A4_W, A4_H)
    return page


writer = PdfWriter()
writer.add_page(normalize(PdfReader(COVER_PDF).pages[0]))
for pg in PdfReader(BODY_PDF).pages:
    writer.add_page(normalize(pg))
writer.add_metadata({
    "/Title": DOC_TITLE,
    "/Author": "Z.ai",
    "/Creator": "Z.ai",
    "/Subject": "Roadmap strategis 99 langkah Gunara OS menuju acuan dunia",
})
os.makedirs(os.path.dirname(FINAL_PDF), exist_ok=True)
with open(FINAL_PDF, "wb") as f:
    writer.write(f)
print("final:", FINAL_PDF, os.path.getsize(FINAL_PDF), "bytes,",
      len(writer.pages), "halaman")
