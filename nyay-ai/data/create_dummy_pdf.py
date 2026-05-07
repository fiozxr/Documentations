from reportlab.pdfgen import canvas
import os

def create_pdf(filename, text):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "The Indian Contract Act, 1872")
    c.drawString(100, 730, "Section 1: Short title, extent and commencement.")
    c.drawString(100, 710, "This Act may be called the Indian Contract Act, 1872.")
    c.drawString(100, 690, "It extends to the whole of India.")
    c.drawString(100, 670, "Section 2: Interpretation-clause.")
    c.drawString(100, 650, "(a) When one person signifies to another his willingness to do or to abstain from doing")
    c.drawString(100, 630, "anything, with a view to obtaining the assent of that other to such act or abstinence,")
    c.drawString(100, 610, "he is said to make a proposal.")

    # Adding some specific data to test exact retrieval
    c.drawString(100, 570, "Penalty for breach of contract:")
    c.drawString(100, 550, "If a contract is broken, the party who suffers by such breach is entitled to receive,")
    c.drawString(100, 530, "from the party who has broken the contract, compensation for any loss or damage.")
    c.save()

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "indian_contract_act_sample.pdf")
    create_pdf(file_path, "sample text")
    print(f"Created {file_path}")
