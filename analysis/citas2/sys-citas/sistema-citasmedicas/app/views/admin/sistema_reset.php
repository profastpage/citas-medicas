<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<style>
    /* ======================================================
       SISTEMA RESET - PREMIUM UI
    ====================================================== */
    .sr-hero {
        background: linear-gradient(135deg, #1a1f35 0%, #0d1b2a 100%);
        border-radius: 16px;
        padding: 2rem 2.5rem;
        margin-bottom: 2rem;
        position: relative;
        overflow: hidden;
    }
    .sr-hero::before {
        content: '';
        position: absolute;
        top: -60px; right: -60px;
        width: 200px; height: 200px;
        background: radial-gradient(circle, rgba(13,110,253,0.25) 0%, transparent 70%);
        border-radius: 50%;
    }
    .sr-hero-title {
        font-size: 1.7rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
    }
    .sr-hero-sub {
        color: #8ea3b8;
        font-size: 0.9rem;
        margin-top: 4px;
    }
    .sr-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(220,53,69,0.15);
        color: #ff6b6b;
        border: 1px solid rgba(220,53,69,0.3);
        border-radius: 50px;
        padding: 4px 14px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    /* CARDS */
    .sr-card {
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
        overflow: hidden;
        height: 100%;
    }
    .sr-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    .sr-card-header {
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .sr-card-header .icon-wrap {
        width: 44px; height: 44px;
        border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem;
        flex-shrink: 0;
    }
    .sr-card-header h5 {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
    }
    .sr-card-body {
        padding: 1.5rem;
        background: #fff;
        flex: 1;
    }

    /* BACKUP CARD */
    .card-backup .sr-card-header { background: linear-gradient(135deg, #0d6efd, #0a58ca); }
    .card-backup .sr-card-header .icon-wrap { background: rgba(255,255,255,0.2); color: #fff; }
    .card-backup .sr-card-header h5 { color: #fff; }

    /* RESTORE CARD */
    .card-restore .sr-card-header { background: linear-gradient(135deg, #0dcaf0, #0aa2c0); }
    .card-restore .sr-card-header .icon-wrap { background: rgba(255,255,255,0.2); color: #fff; }
    .card-restore .sr-card-header h5 { color: #fff; }

    /* RESET CARD */
    .card-reset {
        border: 2px solid rgba(220,53,69,0.2) !important;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(220,53,69,0.08);
    }
    .card-reset .sr-card-header {
        background: linear-gradient(135deg, #dc3545, #b02a37);
    }
    .card-reset .sr-card-header .icon-wrap { background: rgba(255,255,255,0.2); color: #fff; }
    .card-reset .sr-card-header h5 { color: #fff; }

    /* UPLOAD ZONE */
    .upload-zone {
        border: 2px dashed #b0c4de;
        border-radius: 12px;
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #f7fafd;
    }
    .upload-zone:hover, .upload-zone.dragover {
        border-color: #0dcaf0;
        background: #e0f7fe;
    }
    .upload-zone .upload-icon {
        font-size: 2.2rem;
        color: #0dcaf0;
        margin-bottom: 0.5rem;
    }
    .upload-zone input[type="file"] {
        display: none;
    }
    .file-selected-name {
        display: none;
        background: #e8f5e9;
        border: 1px solid #a5d6a7;
        border-radius: 8px;
        padding: 8px 14px;
        margin-top: 10px;
        font-size: 0.85rem;
        color: #2e7d32;
        font-weight: 600;
    }

    /* DANGER LIST */
    .danger-list { list-style: none; padding: 0; margin: 0; }
    .danger-list li {
        display: flex; align-items: center; gap: 8px;
        padding: 6px 0;
        font-size: 0.88rem;
        color: #495057;
        border-bottom: 1px solid #f0f0f0;
    }
    .danger-list li:last-child { border-bottom: none; }
    .danger-list li .dot {
        width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        background: #dc3545;
    }
    .danger-list li.safe .dot { background: #198754; }
    .danger-list li.safe { color: #198754; font-weight: 600; }

    /* PASSWORD FIELD */
    .pass-group { position: relative; }
    .pass-group .toggle-pass {
        position: absolute; right: 12px; top: 50%;
        transform: translateY(-50%);
        cursor: pointer; color: #6c757d;
        background: none; border: none; padding: 0;
    }
    .pass-group .toggle-pass:hover { color: #dc3545; }

    /* STEP INDICATORS */
    .step-indicator {
        display: flex; align-items: center; gap: 8px; margin-bottom: 1rem;
    }
    .step-indicator .step-num {
        width: 26px; height: 26px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .step-indicator span { font-size: 0.85rem; color: #6c757d; }
</style>

<!-- Hero Header -->
<div class="sr-hero">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
            <h2 class="sr-hero-title"><i class="fas fa-database me-2 text-primary"></i>Mantenimiento del Sistema</h2>
            <p class="sr-hero-sub mb-0">Gestión de copias de seguridad, restauración y restablecimiento del sistema</p>
        </div>
        <span class="sr-badge"><i class="fas fa-lock"></i> Solo Administradores</span>
    </div>
</div>

<!-- ROW 1: BACKUP + RESTORE -->
<div class="row g-4 mb-4">

    <!-- BACKUP CARD -->
    <div class="col-lg-6">
        <div class="sr-card card-backup d-flex flex-column">
            <div class="sr-card-header">
                <div class="icon-wrap"><i class="fas fa-cloud-download-alt"></i></div>
                <h5>Copia de Seguridad</h5>
            </div>
            <div class="sr-card-body d-flex flex-column">
                <p class="text-muted mb-3" style="font-size:0.9rem;">
                    Genera y descarga un archivo <code>.sql</code> completo con toda la estructura y datos actuales de la base de datos. Guárdalo en un lugar seguro.
                </p>

                <div class="step-indicator">
                    <div class="step-num bg-primary text-white">1</div>
                    <span>Hacer clic en el botón para generar el backup</span>
                </div>
                <div class="step-indicator">
                    <div class="step-num bg-primary text-white">2</div>
                    <span>El archivo se descargará automáticamente</span>
                </div>
                <div class="step-indicator">
                    <div class="step-num bg-primary text-white">3</div>
                    <span>Guarda el archivo <code>.sql</code> en un lugar seguro</span>
                </div>

                <div class="mt-auto pt-3">
                    <a href="<?php echo BASE_URL; ?>/sistema/backup" class="btn btn-primary w-100 fw-bold py-2" id="btnBackup" onclick="iniciarDescarga(this)">
                        <i class="fas fa-cloud-download-alt me-2"></i> Generar y Descargar Backup
                    </a>
                    <p class="text-muted text-center mt-2 mb-0" style="font-size:0.78rem;">
                        <i class="fas fa-clock me-1"></i> Se recomienda hacer backups periódicamente
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- RESTORE CARD -->
    <div class="col-lg-6">
        <div class="sr-card card-restore d-flex flex-column">
            <div class="sr-card-header">
                <div class="icon-wrap"><i class="fas fa-cloud-upload-alt"></i></div>
                <h5>Restaurar Base de Datos</h5>
            </div>
            <div class="sr-card-body d-flex flex-column">
                <p class="text-muted mb-3" style="font-size:0.9rem;">
                    Sube un archivo <code>.sql</code> generado previamente para restaurar el sistema a un estado anterior. <strong>Los datos actuales serán reemplazados.</strong>
                </p>

                <form action="<?php echo BASE_URL; ?>/sistema/restaurar" method="POST" enctype="multipart/form-data" id="formRestore">
                    <!-- Upload Zone -->
                    <div class="upload-zone" id="uploadZone" onclick="document.getElementById('backup_file').click()">
                        <div class="upload-icon"><i class="fas fa-file-upload"></i></div>
                        <p class="mb-1 fw-semibold text-secondary">Arrastra tu archivo aquí</p>
                        <p class="text-muted mb-0" style="font-size:0.8rem;">o haz clic para seleccionar</p>
                        <small class="text-muted">Solo archivos .sql</small>
                        <input type="file" name="backup_file" id="backup_file" accept=".sql" required onchange="mostrarArchivoSeleccionado(this)">
                    </div>
                    <div class="file-selected-name" id="fileSelectedName">
                        <i class="fas fa-check-circle me-1"></i> <span id="fileNameText"></span>
                    </div>

                    <div class="mt-auto pt-3">
                        <button type="button" class="btn btn-info text-white w-100 fw-bold py-2" onclick="confirmarRestore()">
                            <i class="fas fa-cloud-upload-alt me-2"></i> Subir y Restaurar Sistema
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- ROW 2: RESET CARD (Full Width) -->
<div class="row">
    <div class="col-12">
        <div class="sr-card card-reset">
            <div class="sr-card-header">
                <div class="icon-wrap"><i class="fas fa-exclamation-triangle"></i></div>
                <div>
                    <h5 class="mb-0">Restablecer Sistema para Nuevo Negocio</h5>
                    <small style="color:rgba(255,255,255,0.7); font-size:0.8rem;">Acción irreversible · Solo para entrega del sistema a un nuevo cliente</small>
                </div>
            </div>
            <div class="sr-card-body">
                <div class="row align-items-start g-4">

                    <!-- Descripción -->
                    <div class="col-lg-5">
                        <h6 class="fw-bold text-secondary mb-3" style="text-transform:uppercase; letter-spacing:.5px; font-size:.78rem;">
                            <i class="fas fa-info-circle me-1 text-danger"></i> ¿Qué hace esta acción?
                        </h6>
                        <p class="text-muted" style="font-size:0.88rem;">
                            Limpia completamente todos los datos operativos del sistema dejándolo como una instalación nueva, ideal para entregar el software a una nueva clínica o empresa.
                        </p>
                        <div class="bg-light rounded-3 p-3" style="border-left: 4px solid #dc3545;">
                            <p class="mb-2 fw-bold text-danger" style="font-size:.82rem;"><i class="fas fa-trash-alt me-1"></i> SE ELIMINARÁ:</p>
                            <ul class="danger-list">
                                <li><div class="dot"></div> Pacientes y expedientes clínicos</li>
                                <li><div class="dot"></div> Citas médicas (pasadas y futuras)</li>
                                <li><div class="dot"></div> Médicos y horarios</li>
                                <li><div class="dot"></div> Especialidades y servicios/tarifas</li>
                                <li><div class="dot"></div> Farmacia (medicamentos)</li>
                                <li><div class="dot"></div> Pagos, gastos y registros de caja</li>
                                <li><div class="dot"></div> Auditoría y archivos adjuntos</li>
                                <li class="safe"><div class="dot"></div> SE CONSERVA: Datos del administrador y configuración de empresa</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Formulario -->
                    <div class="col-lg-7">
                        <div class="bg-warning bg-opacity-10 border border-warning rounded-3 p-3 mb-4">
                            <div class="d-flex gap-2">
                                <i class="fas fa-shield-alt text-warning mt-1 flex-shrink-0"></i>
                                <div>
                                    <strong style="font-size:.88rem;">Se recomienda hacer un Backup antes de ejecutar esta acción.</strong>
                                    <p class="mb-0 text-muted" style="font-size:.82rem;">Una vez ejecutado, los datos NO podrán recuperarse sin un archivo de respaldo.</p>
                                </div>
                            </div>
                        </div>

                        <form action="<?php echo BASE_URL; ?>/sistema/ejecutarReset" method="POST" id="formReset">
                            <div class="mb-3">
                                <label class="form-label fw-semibold" style="font-size:.88rem;">
                                    <i class="fas fa-key me-1 text-danger"></i> Confirme con su Contraseña de Administrador
                                </label>
                                <div class="pass-group">
                                    <input type="password" name="password" id="passwordReset" class="form-control form-control-lg" 
                                           placeholder="Ingrese su contraseña para confirmar" required
                                           style="border-color:#dc3545; padding-right:44px;">
                                    <button type="button" class="toggle-pass" onclick="togglePass('passwordReset', this)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="confirmCheck" required>
                                    <label class="form-check-label text-muted" for="confirmCheck" style="font-size:.85rem;">
                                        Entiendo que esta acción es <strong>irreversible</strong> y elimina todos los datos operativos del sistema.
                                    </label>
                                </div>
                            </div>

                            <button type="button" class="btn btn-danger w-100 fw-bold py-2" onclick="confirmarReset()">
                                <i class="fas fa-trash-alt me-2"></i> CONFIRMAR Y RESTABLECER SISTEMA
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>

<script>
// ============================================================
// UPLOAD ZONE - Drag & Drop
// ============================================================
const uploadZone = document.getElementById('uploadZone');

['dragenter','dragover'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
});
['dragleave','drop'].forEach(evt => {
    uploadZone.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if(evt === 'drop' && e.dataTransfer.files.length > 0) {
            const dt = e.dataTransfer;
            const fileInput = document.getElementById('backup_file');
            fileInput.files = dt.files;
            mostrarArchivoSeleccionado(fileInput);
        }
    });
});

function mostrarArchivoSeleccionado(input) {
    const nameEl = document.getElementById('fileNameText');
    const nameBox = document.getElementById('fileSelectedName');
    if(input.files.length > 0) {
        nameEl.textContent = input.files[0].name;
        nameBox.style.display = 'block';
    }
}

// ============================================================
// TOGGLE PASSWORD VISIBILITY
// ============================================================
function togglePass(id, btn) {
    const input = document.getElementById(id);
    if(input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ============================================================
// BACKUP - Feedback visual
// ============================================================
function iniciarDescarga(btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Generando backup...';
    btn.classList.add('disabled');
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-cloud-download-alt me-2"></i> Generar y Descargar Backup';
        btn.classList.remove('disabled');
    }, 5000);
}

// ============================================================
// RESTORE - Confirmación
// ============================================================
function confirmarRestore() {
    const fileInput = document.getElementById('backup_file');
    if(fileInput.files.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Archivo requerido',
            text: 'Debes seleccionar un archivo .sql primero.',
            confirmButtonColor: '#0dcaf0'
        });
        return;
    }

    Swal.fire({
        title: '¿Restaurar la Base de Datos?',
        html: `<p>El archivo <strong>${fileInput.files[0].name}</strong> se usará para restaurar el sistema.</p>
               <p class="text-danger mb-0"><strong>⚠ Todos los datos actuales serán reemplazados.</strong></p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0dcaf0',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="fas fa-cloud-upload-alt me-1"></i> Sí, Restaurar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('formRestore').submit();
        }
    });
}

// ============================================================
// RESET - Confirmación doble
// ============================================================
function confirmarReset() {
    const checkbox = document.getElementById('confirmCheck');
    const password = document.getElementById('passwordReset').value;

    if(!password) {
        Swal.fire({ icon: 'error', title: 'Contraseña requerida', text: 'Debes ingresar tu contraseña de administrador.', confirmButtonColor: '#dc3545' });
        return;
    }
    if(!checkbox.checked) {
        Swal.fire({ icon: 'warning', title: 'Confirmación requerida', text: 'Debes marcar la casilla de confirmación antes de continuar.', confirmButtonColor: '#ffc107' });
        return;
    }

    Swal.fire({
        title: '¿ESTÁS ABSOLUTAMENTE SEGURO?',
        html: `<p>Esta acción eliminará <strong>TODA la información operativa</strong> del sistema de forma permanente.</p>
               <p class="text-danger"><strong>Pacientes, citas, médicos, servicios, pagos y más serán borrados.</strong></p>
               <p class="text-success mb-0">Solo se conservarán los datos de configuración y el administrador.</p>`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="fas fa-trash-alt me-1"></i> Sí, BORRAR TODO',
        cancelButtonText: '<i class="fas fa-times me-1"></i> Cancelar, no hacer nada',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('formReset').submit();
        }
    });
}

// ============================================================
// MENSAJES DE RESPUESTA (Query params)
// ============================================================
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

const mensajes = {
    'error_pass': { icon: 'error', title: '¡Contraseña incorrecta!', text: 'La contraseña ingresada no es válida. Por favor intente de nuevo.' },
    'error_db':   { icon: 'error', title: 'Error en Base de Datos', text: urlParams.get('detail') || 'Ocurrió un error al ejecutar el restablecimiento. Verifique los logs del servidor.' },
    'restore_invalid': { icon: 'error', title: 'Archivo inválido', text: 'El archivo seleccionado debe tener extensión .sql obligatoriamente.' },
    'restore_error':   { icon: 'error', title: 'Error al procesar', text: 'Ocurrió un error al leer el archivo de respaldo. Verifique que el archivo no esté dañado.' },
    'restore_error_db':{ icon: 'error', title: 'Error SQL', text: 'El archivo SQL contiene errores y no pudo ser ejecutado correctamente.' },
    'restore_ok': { icon: 'success', title: '¡Restauración exitosa!', text: 'La base de datos ha sido restaurada correctamente desde el archivo de backup.' },
    'backup_error': { icon: 'error', title: 'Error al generar Backup', text: 'Ocurrió un problema interno al generar la copia de seguridad.' }
};

if(msg && mensajes[msg]) {
    const m = mensajes[msg];
    Swal.fire({
        icon: m.icon,
        title: m.title,
        text: m.text,
        confirmButtonColor: m.icon === 'success' ? '#198754' : '#dc3545'
    });
    window.history.replaceState({}, document.title, window.location.pathname);
}
</script>