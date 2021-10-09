<?php
    require('add-variant.html');

    class DB extends SQLite3
    {
        function __construct()
        {
            $this->open('../../../backend/data/dorayaki.db');
        }
    }
    $db = new DB();

    if (isset($_POST['nama'])) {
        $check = $db->query('select dorayaki_name from dorayaki;');

        // Check if Dorayaki Exists
        $found = false;
        while($res = $check->fetchArray(SQLITE3_ASSOC)){ 
            if (!strcmp($res['dorayaki_name'], $_POST['nama'])) {
                $found = true;
            } 
         } 

        if ($found) {
            echo '<script>alert("Varian sudah ada")</script>';
        } else {
            // Save Image
            $upload_file = 'image/' .basename($_FILES['image']['name']);
    
            move_uploaded_file($_FILES['image']['tmp_name'], $upload_file);
            
            $nama = $_POST['nama'];
            $stok = $_POST['stok'];
            $harga = $_POST['harga'];
            $desc = $_POST['desc'];
            
            // Insert
            $query = <<<EOF
            INSERT INTO dorayaki(id_dorayaki, dorayaki_name, stock, sold_stock, price, desc, photo)
            VALUES(NULL, '$nama', '$stok', 0, $harga, '$desc', '$upload_file');
            EOF;
            $db->exec($query);
    
            echo '<script>alert("Varian Berhasil Ditambahkan")</script>';
        }
        exit;
    }
?>