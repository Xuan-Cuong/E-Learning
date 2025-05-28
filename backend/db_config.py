# backend/db_config.py
import pyodbc

# --- THAY ĐỔI THÔNG TIN KẾT NỐI CỦA BẠN TẠI ĐÂY ---
DB_SERVER = 'LAPTOP-E9SB1EP2'  # Ví dụ: 'DESKTOP-ABC\SQLEXPRESS' hoặc 'your_server.database.windows.net'
DB_DATABASE = 'E-Learning'    # Tên database bạn đã tạo ở Bước 1
DB_USERNAME = 'sa' # Nếu dùng SQL Server Authentication
DB_PASSWORD = '123456' # Nếu dùng SQL Server Authentication

# Connection string (ví dụ cho Windows Authentication - phổ biến khi phát triển local)
#CONN_STRING = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={DB_SERVER};DATABASE={DB_DATABASE};Trusted_Connection=yes;'

# Connection string (ví dụ cho SQL Server Authentication)
CONN_STRING = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={DB_SERVER};DATABASE={DB_DATABASE};UID={DB_USERNAME};PWD={DB_PASSWORD};TrustServerCertificate=yes' # Added TrustServerCertificate for local SQL Server


def get_db_connection():
    try:
        conn = pyodbc.connect(CONN_STRING)
        return conn
    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Lỗi kết nối Database. SQLSTATE: {sqlstate}")
        print(ex) # In chi tiết lỗi ra console của backend
        return None

if __name__ == '__main__':
    conn = get_db_connection()
    if conn:
        print("Kết nối Database thành công!")
        cursor = conn.cursor()
        cursor.execute("SELECT DB_NAME() AS CurrentDatabase")
        row = cursor.fetchone()
        print(f"Đang kết nối tới Database: {row.CurrentDatabase}")
        conn.close()
    else:
        print("Kết nối Database thất bại.")