from unstructured.partition.pdf import partition_pdf

def extract_pdf_elements(file_path: str):
    """
    Extracts text, tables, and images from a PDF using unstructured library.
    Returns a list of CompositeElements (text/tables/images).
    """
    try:
        chunks = partition_pdf(
            filename=file_path,
            infer_table_structure=True,
            strategy="fast",
            extract_image_block_types=["Image"],
            extract_image_block_to_payload=True,
            chunking_strategy="by_title",
            max_characters=10000,
            combine_text_under_n_chars=2000,
            new_after_n_chars=6000,
        )
        return chunks
    except Exception as e:
        print(f"⚠️ Error extracting PDF elements: {e}")
        return []
