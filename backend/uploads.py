# backend/uploads.py
import os
from werkzeug.utils import secure_filename
import uuid # For more robust unique filenames

UPLOAD_FOLDER = 'uploads' 
# Define specific subfolders
VIDEO_FOLDER = os.path.join(UPLOAD_FOLDER, 'videos')
ATTACHMENT_FOLDER = os.path.join(UPLOAD_FOLDER, 'attachments')
IMAGE_FOLDER = os.path.join(UPLOAD_FOLDER, 'images') # For course images etc.

ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
ALLOWED_ATTACHMENT_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'rar'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def get_allowed_extensions(file_type):
    if file_type == 'videos':
        return ALLOWED_VIDEO_EXTENSIONS
    elif file_type == 'attachments':
        return ALLOWED_ATTACHMENT_EXTENSIONS
    elif file_type == 'images':
        return ALLOWED_IMAGE_EXTENSIONS
    return set()

def allowed_file(filename, file_type):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in get_allowed_extensions(file_type)

def init_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    if not os.path.exists(VIDEO_FOLDER):
        os.makedirs(VIDEO_FOLDER)
    if not os.path.exists(ATTACHMENT_FOLDER):
        os.makedirs(ATTACHMENT_FOLDER)
    if not os.path.exists(IMAGE_FOLDER):
        os.makedirs(IMAGE_FOLDER)


def save_uploaded_file(file_storage, sub_folder):
    """
    Saves an uploaded file to a specified sub_folder within UPLOAD_FOLDER.
    Args:
        file_storage (FileStorage): The file object from Flask request.
        sub_folder (str): 'videos', 'attachments', or 'images'.
    Returns:
        str: The unique filename (e.g., 'unique_id_original_name.ext') if successful, else None.
    """
    if file_storage and file_storage.filename and allowed_file(file_storage.filename, sub_folder):
        original_filename = secure_filename(file_storage.filename)
        # Create a unique filename to prevent overwrites and handle special characters
        filename_stem, filename_ext = os.path.splitext(original_filename)
        unique_id = uuid.uuid4().hex[:8] # Short unique ID
        unique_filename = f"{unique_id}_{filename_stem}{filename_ext}"
        
        target_folder = os.path.join(UPLOAD_FOLDER, sub_folder)
        if not os.path.exists(target_folder):
            os.makedirs(target_folder)
            
        file_path = os.path.join(target_folder, unique_filename)
        
        try:
            file_storage.save(file_path)
            return unique_filename # Return just the filename, path will be constructed
        except Exception as e:
            print(f"Error saving file {unique_filename} to {file_path}: {e}")
            return None
    return None