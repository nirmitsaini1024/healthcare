<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file_name = $_FILES['file']['name'];
        $tmp_name = $_FILES['file']['tmp_name'];
        
        // Validate file type and size (adjust as needed)
        $allowed_extensions = array('jpg', 'jpeg', 'png');
        $max_file_size = 5 * 1024 * 1024; // 5 MB
        
        $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        if (!in_array($file_extension, $allowed_extensions)) {
            die('Error: Unsupported file type.');
        }
        
        if ($_FILES['file']['size'] > $max_file_size) {
            die('Error: File size exceeds the limit.');
        }
        
        // Generate a unique file name to prevent conflicts
        $file_up_name = time() . '_' . $file_name;
        
        // Move the uploaded file to the destination directory
        if (move_uploaded_file($tmp_name, "files/" . $file_up_name)) {
            echo 'File uploaded successfully.';
        } else {
            echo 'Error: Failed to move the file.';
        }
    } else {
        echo 'Error: No file uploaded or upload error occurred.';
    }
} else {
    echo 'Error: Invalid request method.';
}
?>
