import os
from werkzeug.utils import secure_filename
from flask import current_app

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def init_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        os.makedirs(os.path.join(UPLOAD_FOLDER, 'videos'))
        os.makedirs(os.path.join(UPLOAD_FOLDER, 'attachments'))

def save_uploaded_file(file, file_type):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Generate unique filename
        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(os.path.join(UPLOAD_FOLDER, file_type, filename)):
            filename = f"{base}_{counter}{ext}"
            counter += 1
        
        file_path = os.path.join(UPLOAD_FOLDER, file_type, filename)
        file.save(file_path)
        return filename
    return None
