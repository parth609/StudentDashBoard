let table;

// Handle file upload
document.getElementById('fileUpload').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        loadTable(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

function loadTable(data) {
    if (table) {
        table.destroy();
    }
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="select-student" data-email="${row.Email || ""}"></td>
            <td>${row.Name || ""}</td>
            <td>${row.Branch || ""}</td>
            <td>${row.Year || ""}</td>
            <td>${row.Email || ""}</td>
            <td>${row.Interests || ""}</td>
        `;
        tbody.appendChild(tr);
    });

    table = $('#studentTable').DataTable();
}

// Send email to selected students
document.getElementById('sendEmailBtn').addEventListener('click', function () {
    let selectedEmails = [];
    document.querySelectorAll('#studentTable tbody input[type="checkbox"]:checked')
        .forEach(cb => {
            selectedEmails.push(cb.dataset.email);
        });

    if (selectedEmails.length === 0) {
        alert("No students selected!");
        return;
    }

    console.log(selectedEmails);
    alert("Selected students:\n" + selectedEmails.join("\n"));

    // Demo only – opens default email client
    window.location.href = "mailto:" + selectedEmails.join(",");
});

// Export filtered data as CSV
document.getElementById('exportBtn').addEventListener('click', function () {
    const filteredData = table.rows({ search: 'applied' }).data().toArray();
    const csvContent = "data:text/csv;charset=utf-8," +
        filteredData.map(row => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "filtered_students.csv");
    link.click();
});