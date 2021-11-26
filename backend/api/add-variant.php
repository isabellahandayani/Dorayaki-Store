<?php
try {
	$db = new PDO('sqlite:../data/dorayaki.db');

	if (isset($_GET['getDorayaki']) && $_GET['getDorayaki']) {
		$client = new SoapClient("http://localhost:1111/dorayaki?wsdl");
		$result = $client->getDorayakis();
		$array = json_decode(json_encode($result), true);
		die(json_encode($array));
	}

	if (isset($_POST['nama'])) {
		// Check if Dorayaki Exists
		$query = <<<EOF
		SELECT dorayaki_name 
		FROM dorayaki where dorayaki_name = ?
		EOF;

		$check = $db->prepare($query);
		$check->execute(array($_POST['nama']));

		$res = $check->fetch(PDO::FETCH_ASSOC);
		if ($res) {
			echo "<script>alert('Varian Sudah Ada!');window.location.href='../../frontend/pages/add-variant/'</script>";
		} else {
			$name = $_POST['nama']; 
			$arr = explode("-",$name);
			// Save Image
			$name = basename($_FILES['image']['name']);
			$upload_file = '../image/' . $name;

			move_uploaded_file($_FILES['image']['tmp_name'], $upload_file);

			// $stok = $_POST['stok'];
			$harga = $_POST['harga'];
			$desc = $_POST['desc'];

			// Insert
			$query = <<<EOF
                INSERT INTO dorayaki(id_dorayaki, dorayaki_name, stock, sold_stock, price, desc, photo)
                VALUES('$arr[0]', '$arr[1]', 0, 0, $harga, '$desc', '$name');
                EOF;
			$db->exec($query);

			echo "<script>alert('Varian berhasil ditambahkan!');window.location.href='../../frontend/pages/add-variant/'</script>";
		}
	}
} catch (PDOException $e) {
	print $e->getMessage();
}
