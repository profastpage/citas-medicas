<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="container-fluid px-4 py-4" style="background:#f4f6f9; min-height: 100vh;">
    <div class="card shadow border-0 mb-4">
        <!-- HEADER -->
        <div class="card-header py-3 px-4" style="background:linear-gradient(135deg,#0f3460,#11998e);">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <i class="fas fa-stethoscope fa-2x text-white"></i>
                    <div>
                        <h4 class="text-white mb-0 fw-bold" id="labelModalAtencion">Atención Médica</h4>
                        <div class="text-white-50" id="atencion_subtitulo">—</div>
                    </div>
                </div>
                <div class="d-flex gap-2 ms-auto">
                    <button type="button" id="btnImprimirAtencion" class="btn btn-light rounded-pill px-3 fw-bold" onclick="imprimirAtencion()">
                        <i class="fas fa-print me-1"></i> Imprimir
                    </button>
                    <a href="<?php echo BASE_URL; ?>/citas" class="btn btn-outline-light rounded-pill px-3 fw-bold">
                        <i class="fas fa-arrow-left me-1"></i> Retornar
                    </a>
                </div>
            </div>
        </div>

        <div class="card-body p-0">
            <form action="<?php echo BASE_URL; ?>/citas/finalizar" method="POST" id="formAtencion">
                <input type="hidden" name="id_cita" id="atencion_id_cita" value="<?php echo htmlspecialchars($_GET['id'] ?? ''); ?>">

                <!-- BODY -->
                <div class="p-4">

                    <!-- ============ APARTADO 1: DATOS DEL PACIENTE ============ -->
                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-header fw-bold py-2 px-4" style="background:linear-gradient(90deg,#0f3460,#2575fc); color:#fff;">
                            <i class="fas fa-user-circle me-2"></i> APARTADO 1 — Datos del Paciente
                        </div>
                        <div class="card-body pb-3">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Nombres y Apellidos</label>
                                    <div class="form-control bg-light fw-bold" id="a1_nombre">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">DNI / Doc.</label>
                                    <div class="form-control bg-light" id="a1_dni">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Fecha Nac.</label>
                                    <div class="form-control bg-light" id="a1_fnac">—</div>
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Edad</label>
                                    <div class="form-control bg-light text-center fw-bold text-primary" id="a1_edad">—</div>
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Sexo</label>
                                    <div class="form-control bg-light text-center" id="a1_sexo">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Celular</label>
                                    <div class="form-control bg-light" id="a1_telefono">—</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Persona Responsable</label>
                                    <div class="form-control bg-light" id="a1_responsable">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Tel. Responsable</label>
                                    <div class="form-control bg-light" id="a1_tel_resp">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">N° Hx Clínica</label>
                                    <div class="form-control bg-light" id="a1_hxclinica">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Fecha Atención</label>
                                    <div class="form-control bg-light" id="a1_fecha_cita">—</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold text-uppercase text-muted">Servicio</label>
                                    <div class="form-control bg-light" id="a1_servicio">—</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============ APARTADO 2: TRIAJE + ANAMNESIS ============ -->
                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-header fw-bold py-2 px-4" style="background:linear-gradient(90deg,#f7971e,#ffd200); color:#1a1a2e;">
                            <i class="fas fa-heartbeat me-2"></i> APARTADO 2 — Triaje y Anamnesis
                        </div>
                        <div class="card-body pb-3">
                            <!-- TRIAJE ROW -->
                            <h6 class="fw-bold text-uppercase text-muted small border-bottom pb-1 mb-3">Signos Vitales / Triaje</h6>
                            <div class="row g-2 mb-4">
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">Peso (kg)</label>
                                    <input type="text" name="peso" id="v_peso" class="form-control" placeholder="70">
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">Talla (cm)</label>
                                    <input type="text" name="talla" id="v_talla" class="form-control" placeholder="170">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold">PA (mmHg)</label>
                                    <div class="input-group">
                                        <input type="text" name="pa_sis" id="v_pa_sis" class="form-control" placeholder="120" title="Sistólica">
                                        <span class="input-group-text px-1">/</span>
                                        <input type="text" name="pa_dia" id="v_pa_dia" class="form-control" placeholder="80" title="Diastólica">
                                    </div>
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">FC (×/min)</label>
                                    <input type="text" name="fc" id="v_fc" class="form-control" placeholder="72">
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">FR (×/min)</label>
                                    <input type="text" name="fr" id="v_fr" class="form-control" placeholder="16">
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">SAT O₂ (%)</label>
                                    <input type="text" name="sat_o2" id="v_sat_o2" class="form-control" placeholder="98">
                                </div>
                                <div class="col-md-1">
                                    <label class="form-label small fw-bold">T° (°C)</label>
                                    <input type="text" name="temperatura" id="v_temperatura" class="form-control" placeholder="36.5">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold">Tiempo de Enfermedad</label>
                                    <input type="text" name="tiempo_enfermedad" id="v_tiempo_enf" class="form-control" placeholder="3 días">
                                </div>
                            </div>

                            <!-- ANAMNESIS -->
                            <h6 class="fw-bold text-uppercase text-muted small border-bottom pb-1 mb-3">Anamnesis</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Motivo de Consulta</label>
                                    <textarea name="motivo_consulta" id="v_motivo_consulta" class="form-control" rows="3" placeholder="Describa el motivo principal..."></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Enfermedad Actual</label>
                                    <textarea name="enfermedad_actual" id="v_enf_actual" class="form-control" rows="3" placeholder="Descripción detallada de la enfermedad actual..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Antecedentes</label>
                                    <textarea name="antecedentes" id="v_antecedentes" class="form-control" rows="4" placeholder="Antecedentes patológicos, quirúrgicos, familiares, alergias, etc..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============ APARTADO 2B: EXAMEN FÍSICO / AUXILIARES ============ -->
                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-header fw-bold py-2 px-4" style="background:linear-gradient(90deg,#11998e,#38ef7d); color:#1a1a2e;">
                            <i class="fas fa-search-plus me-2"></i> APARTADO 2B — Examen Físico y Auxiliares
                        </div>
                        <div class="card-body pb-3">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Examen Físico</label>
                                    <textarea name="examen_fisico" id="v_examen_fisico" class="form-control" rows="6" placeholder="Hallazgos en el examen físico por sistemas..."></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Exámenes Auxiliares <small class="text-muted fw-normal">(laboratorio, imágenes, informes)</small></label>
                                    <textarea name="examenes_auxiliares" id="v_examenes_aux" class="form-control mb-2" rows="3" placeholder="Ej: Hemograma 18-03-25: Hb 12.5, Hct 38%...&#10;Rx Tórax 18-03-25: Sin hallazgos patológicos..."></textarea>
                                    <label class="form-label small fw-bold mt-2"><i class="fas fa-paperclip me-1"></i>Archivos Adjuntos del Paciente</label>
                                    <div id="v_archivos_paciente" class="list-group border rounded shadow-sm" style="max-height: 160px; overflow-y: auto; font-size: 0.85rem;">
                                        <!-- Se llenará mediante JS -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============ APARTADO 3: DIAGNÓSTICO Y TRATAMIENTO ============ -->
                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-header fw-bold py-2 px-4" style="background:linear-gradient(90deg,#6a11cb,#2575fc); color:#fff;">
                            <i class="fas fa-diagnoses me-2"></i> APARTADO 3 — Diagnóstico y Tratamiento
                        </div>
                        <div class="card-body pb-3">
                            <div class="row g-3">
                                <div class="col-md-5">
                                    <label class="form-label small fw-bold">Diagnóstico(s) <span class="text-danger">*</span></label>
                                    <textarea name="diagnostico" id="v_diagnostico" class="form-control" rows="4" placeholder="CIE-10 o descripción diagnóstica..."></textarea>
                                </div>
                                <div class="col-md-7">
                                    <label class="form-label small fw-bold">Tratamiento / Prescripción <span class="text-danger">*</span></label>
                                    <textarea name="tratamiento" id="v_tratamiento" class="form-control" rows="4" placeholder="Medicamentos, dosis, frecuencia, duración..."></textarea>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label small fw-bold">Receta / Indicaciones adicionales</label>
                                    <textarea name="prescripcion" id="v_prescripcion" class="form-control" rows="3" placeholder="Indicaciones, dieta, reposo, actividad física..."></textarea>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label small fw-bold">Días de Reposo</label>
                                    <input type="number" name="dias_reposo" id="v_dias_reposo" class="form-control" value="0" min="0">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============ APARTADO 4: SEGUIMIENTO ============ -->
                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-header fw-bold py-2 px-4" style="background:linear-gradient(90deg,#1a1a2e,#0f3460); color:#fff;">
                            <i class="fas fa-calendar-check me-2"></i> APARTADO 4 — Seguimiento
                        </div>
                        <div class="card-body pb-3">
                            <div class="row g-3 align-items-end">
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Cita de Reevaluación / Control</label>
                                    <input type="date" name="fecha_control" id="v_fecha_control" class="form-control"
                                           min="<?php echo date('Y-m-d', strtotime('+1 day')); ?>">
                                    <small class="text-muted"><i class="fas fa-bell me-1"></i>Se notificará al recepcionista</small>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Interconsulta a Especialidad</label>
                                    <select name="id_interconsulta_especialidad" id="v_interconsulta" class="form-select">
                                        <option value="">— Sin interconsulta —</option>
                                    </select>
                                </div>
                                <div class="col-md-5">
                                    <div class="alert alert-light border mb-0 py-2">
                                        <small><i class="fas fa-info-circle text-primary me-1"></i>
                                        Si selecciona interconsulta, se generará un registro en el sistema para la especialidad indicada.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /p-4 -->

                <!-- FOOTER -->
                <div class="card-footer bg-light py-3 px-4 d-flex justify-content-between align-items-center rounded-bottom">
                    <div class="text-muted small w-50">
                        <i class="fas fa-info-circle text-primary me-1"></i> Use <strong>Guardar Progreso</strong> si no ha terminado. 
                        Diagnóstico y Tratamiento son obligatorios para <strong>Finalizar</strong>.
                    </div>
                    <div class="d-flex gap-3">
                        <button type="submit" name="accion" value="guardar" class="btn btn-outline-primary rounded-pill px-4 fw-bold shadow-sm">
                            <i class="fas fa-save me-1"></i> Guardar Progreso
                        </button>
                        <button type="submit" name="accion" value="finalizar" onclick="return validarFinalizar()" class="btn btn-success rounded-pill px-5 fw-bold shadow">
                            <i class="fas fa-check-circle me-1"></i> Finalizar Consulta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const idCita = document.getElementById('atencion_id_cita').value;
        if(idCita) cargarAtencion(idCita);
        
        // Alerta de fecha control cuando se seleccione
        const fechaControlEl = document.getElementById('v_fecha_control');
        if (fechaControlEl) {
            fechaControlEl.addEventListener('change', function() {
                if (this.value) {
                    const d = new Date(this.value + 'T12:00:00');
                    const str = d.toLocaleDateString('es-PE', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
                    Swal.fire({
                        icon: 'info', title: 'Cita de Control',
                        text: `Se registrará cita de control para el ${str}. El recepcionista deberá agendarla.`,
                        confirmButtonColor: '#0f3460', timer: 4000, timerProgressBar: true
                    });
                }
            });
        }
    });

    function validarFinalizar() {
        const diag = document.getElementById('v_diagnostico').value.trim();
        const trat = document.getElementById('v_tratamiento').value.trim();
        if (!diag || !trat) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos Incompletos',
                text: 'Falta completar el Diagnóstico y/o Tratamiento. Si desea cerrar, use "Guardar Progreso".',
                confirmButtonColor: '#0f3460'
            });
            return false;
        }
        return true;
    }

    function cargarAtencion(id) {
        // Cargar especialidades para el select de interconsulta
        const selectInt = document.getElementById('v_interconsulta');
        if (selectInt && selectInt.options.length <= 1) {
            fetch(`<?php echo BASE_URL; ?>/especialidades/profesionales`) 
                .then(r => r.json())
                .catch(e => console.log('Sin endpoint de especialidades directo'));
        }

        fetch(`<?php echo BASE_URL; ?>/citas/detalleCita?id=${id}`)
            .then(r => r.json())
            .then(d => {
                if (!d || !d.id_cita) return;

                // Apartado 1 — info paciente
                document.getElementById('a1_nombre').textContent    = d.paciente || '—';
                document.getElementById('a1_dni').textContent       = d.documento_identidad || '—';
                document.getElementById('a1_telefono').textContent  = d.paciente_telefono || '—';
                document.getElementById('a1_servicio').textContent  = d.nombre_servicio || '—';
                document.getElementById('a1_responsable').textContent = d.persona_responsable || '—';
                document.getElementById('a1_tel_resp').textContent  = d.tel_responsable || '—';
                document.getElementById('a1_hxclinica').textContent = d.nro_historia_clinica || '—';

                document.getElementById('atencion_subtitulo').textContent = `Paciente: ${d.paciente} | ${d.nombre_servicio || 'Consulta'}`;

                if (d.fecha_nacimiento) {
                    const fn = new Date(d.fecha_nacimiento + 'T12:00:00');
                    document.getElementById('a1_fnac').textContent = fn.toLocaleDateString('es-PE');
                    const hoy = new Date();
                    let edad = hoy.getFullYear() - fn.getFullYear();
                    const m = hoy.getMonth() - fn.getMonth();
                    if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) edad--;
                    document.getElementById('a1_edad').textContent = edad + ' a';
                } else {
                    document.getElementById('a1_fnac').textContent = '—';
                    document.getElementById('a1_edad').textContent = '—';
                }

                const sexoMap = {M: 'Masculino', F: 'Femenino', Otro: 'Otro'};
                document.getElementById('a1_sexo').textContent = sexoMap[d.sexo] || '—';

                if (d.fecha_cita) {
                    const fc = new Date(d.fecha_cita);
                    document.getElementById('a1_fecha_cita').textContent = fc.toLocaleDateString('es-PE') + ' ' + fc.toLocaleTimeString('es-PE', {hour:'2-digit', minute:'2-digit'});
                }

                const setVal = (id, val) => { const el = document.getElementById(id); if(el && val) el.value = val; };
                setVal('v_peso',        d.peso);
                setVal('v_talla',       d.talla);
                setVal('v_temperatura', d.temperatura);
                setVal('v_fc',          d.fc);
                setVal('v_fr',          d.fr);
                setVal('v_sat_o2',      d.sat_o2);
                setVal('v_tiempo_enf',  d.tiempo_enfermedad);

                if (d.presion_arterial && d.presion_arterial.includes('/')) {
                    const [sis, dia] = d.presion_arterial.split('/');
                    setVal('v_pa_sis', sis.trim());
                    setVal('v_pa_dia', dia.trim());
                }

                setVal('v_motivo_consulta', d.motivo_consulta || d.motivo);
                setVal('v_enf_actual',      d.enfermedad_actual);
                setVal('v_antecedentes',    d.antecedentes || `Alergias: ${d.alergias||'—'}\nEnf. crónicas: ${d.enfermedades_cronicas||'—'}`);

                setVal('v_examen_fisico',   d.examen_fisico);
                setVal('v_examenes_aux',    d.examenes_auxiliares);

                // Archivos Adjuntos
                const containerArchivos = document.getElementById('v_archivos_paciente');
                if (containerArchivos) {
                    containerArchivos.innerHTML = '';
                    if (d.archivos && d.archivos.length > 0) {
                        d.archivos.forEach(file => {
                            let icono = 'fa-file text-secondary';
                            let ext = file.tipo_archivo ? file.tipo_archivo.toLowerCase() : '';
                            if(['jpg','jpeg','png'].includes(ext)) icono = 'fa-file-image text-info';
                            else if(ext === 'pdf') icono = 'fa-file-pdf text-danger';
                            else if(['doc','docx'].includes(ext)) icono = 'fa-file-word text-primary';
                            let fechaStr = '';
                            if (file.fecha_subida) {
                                let f = new Date(file.fecha_subida);
                                fechaStr = ('0'+f.getDate()).slice(-2) + '/' + ('0'+(f.getMonth()+1)).slice(-2) + '/' + f.getFullYear();
                            }
                            containerArchivos.innerHTML += `
                                <a href="<?php echo BASE_URL; ?>${file.ruta_archivo}" target="_blank" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2">
                                    <div class="d-flex align-items-center text-truncate pe-2">
                                        <i class="fas ${icono} fa-lg me-2"></i>
                                        <div class="text-truncate">
                                            <div class="fw-bold text-truncate text-dark" style="max-width: 250px;" title="${file.nombre_archivo}">${file.nombre_archivo}</div>
                                            <small class="text-muted"><i class="far fa-calendar-alt me-1"></i>${fechaStr}</small>
                                        </div>
                                    </div>
                                    <i class="fas fa-external-link-alt text-muted small"></i>
                                </a>
                            `;
                        });
                    } else {
                        containerArchivos.innerHTML = `<div class="p-3 text-center text-muted"><i class="fas fa-folder-open mb-1 fa-2x opacity-50"></i><br>Sin archivos adjuntos.</div>`;
                    }
                }

                setVal('v_diagnostico',  d.diagnostico);
                setVal('v_tratamiento',  d.tratamiento);
                setVal('v_prescripcion', d.prescripcion);

                if (d.dias_reposo) document.getElementById('v_dias_reposo').value = d.dias_reposo;
                setVal('v_fecha_control',  d.fecha_control);
                if (d.id_interconsulta_especialidad) {
                    document.getElementById('v_interconsulta').value = d.id_interconsulta_especialidad;
                }
            })
            .catch(e => console.error('Error cargando detalle de cita:', e));
    }

    function imprimirAtencion() {
        const nombre    = document.getElementById('a1_nombre').textContent;
        const dni       = document.getElementById('a1_dni').textContent;
        const edad      = document.getElementById('a1_edad').textContent;
        const sexo      = document.getElementById('a1_sexo').textContent;
        const tel       = document.getElementById('a1_telefono').textContent;
        const fnac      = document.getElementById('a1_fnac').textContent;
        const hxc       = document.getElementById('a1_hxclinica').textContent;
        const fechaAt   = document.getElementById('a1_fecha_cita').textContent;
        const servicio  = document.getElementById('a1_servicio').textContent;
        const g = id => { const el = document.getElementById(id); return el ? (el.value || '').replace(/\n/g,'<br>') : ''; };
        const clinica   = '<?php echo htmlspecialchars($config['nombre_clinica'] ?? 'Centro Médico'); ?>';
        const direccion = '<?php echo htmlspecialchars($config['direccion'] ?? ''); ?>';
        const telefono  = '<?php echo htmlspecialchars($config['telefono'] ?? ''); ?>';
        <?php
        $logo_url = '';
        if (!empty($config['logo'])) {
            $logo_url = BASE_URL . '/uploads/' . $config['logo'];
        }
        ?>
        const logoUrl = '<?php echo $logo_url; ?>';

        const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<title>Atención Médica — ${nombre}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a2e; padding:20px; }
  .header { display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #0f3460; padding-bottom:10px; margin-bottom:14px; }
  .logo { max-height:60px; }
  .clinica-info { text-align:right; }
  .clinica-info h2 { font-size:15px; color:#0f3460; }
  .clinica-info p { font-size:11px; color:#555; margin:1px 0; }
  .titulo-doc { text-align:center; background:#0f3460; color:#fff; padding:6px; border-radius:4px; margin-bottom:12px; font-size:13px; font-weight:bold; letter-spacing:1px; }
  .paciente-box { background:#f4f6f9; border:1px solid #dbe2ef; border-radius:4px; padding:10px; margin-bottom:12px; }
  .paciente-box .row { display:flex; flex-wrap:wrap; gap:6px 20px; }
  .paciente-box .campo { min-width:130px; }
  .campo label { font-size:10px; text-transform:uppercase; color:#888; display:block; font-weight:bold; }
  .campo span { font-size:12px; font-weight:600; }
  .section { margin-bottom:12px; }
  .section-title { font-size:11px; text-transform:uppercase; letter-spacing:0.5px; font-weight:bold; color:#fff; background:#11998e; padding:3px 8px; border-radius:3px; margin-bottom:6px; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .vitals { display:flex; flex-wrap:wrap; gap:6px 14px; background:#fff9e6; border:1px solid #ffd200; border-radius:4px; padding:8px; margin-bottom:8px; }
  .vital { min-width:70px; text-align:center; }
  .vital label { font-size:9px; text-transform:uppercase; color:#888; display:block; font-weight:bold; }
  .vital span { font-size:13px; font-weight:bold; color:#0f3460; }
  .field-box { background:#f9fafb; border:1px solid #dbe2ef; padding:6px 8px; border-radius:3px; min-height:30px; }
  .signature { margin-top:30px; display:flex; justify-content:flex-end; }
  .sig-box { text-align:center; border-top:1px solid #1a1a2e; padding-top:6px; width:200px; }
  .sig-box p { font-size:11px; }
  footer { margin-top:20px; border-top:1px solid #ddd; padding-top:8px; font-size:10px; color:#999; text-align:center; }
  @media print { body { padding:8px; } }
</style></head><body>
<div class="header">
  ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo">` : '<div></div>'}
  <div class="clinica-info">
    <h2>${clinica}</h2>
    <p>${direccion}</p>
    <p>Tel: ${telefono}</p>
  </div>
</div>
<div class="titulo-doc">REGISTRO DE ATENCIÓN MÉDICA</div>
<div class="paciente-box">
  <div class="row">
    <div class="campo"><label>Paciente</label><span>${nombre}</span></div>
    <div class="campo"><label>DNI</label><span>${dni}</span></div>
    <div class="campo"><label>F. Nacimiento</label><span>${fnac}</span></div>
    <div class="campo"><label>Edad</label><span>${edad}</span></div>
    <div class="campo"><label>Sexo</label><span>${sexo}</span></div>
    <div class="campo"><label>Teléfono</label><span>${tel}</span></div>
    <div class="campo"><label>N° Hx Clínica</label><span>${hxc}</span></div>
    <div class="campo"><label>Servicio</label><span>${servicio}</span></div>
    <div class="campo"><label>Fecha Atención</label><span>${fechaAt}</span></div>
  </div>
</div>
<div class="section">
  <div class="section-title"><i>Triaje — Signos Vitales</i></div>
  <div class="vitals">
    <div class="vital"><label>Peso</label><span>${g('v_peso')} kg</span></div>
    <div class="vital"><label>Talla</label><span>${g('v_talla')} cm</span></div>
    <div class="vital"><label>PA</label><span>${g('v_pa_sis')}/${g('v_pa_dia')}</span></div>
    <div class="vital"><label>FC</label><span>${g('v_fc')} /min</span></div>
    <div class="vital"><label>FR</label><span>${g('v_fr')} /min</span></div>
    <div class="vital"><label>SAT O₂</label><span>${g('v_sat_o2')}%</span></div>
    <div class="vital"><label>T°</label><span>${g('v_temperatura')}°C</span></div>
    <div class="vital"><label>T. Enf.</label><span>${g('v_tiempo_enf')}</span></div>
  </div>
</div>
<div class="section grid2">
  <div><div class="section-title">Motivo de Consulta</div><div class="field-box">${g('v_motivo_consulta')}</div></div>
  <div><div class="section-title">Enfermedad Actual</div><div class="field-box">${g('v_enf_actual')}</div></div>
</div>
<div class="section"><div class="section-title">Antecedentes</div><div class="field-box">${g('v_antecedentes')}</div></div>
<div class="section grid2">
  <div><div class="section-title">Examen Físico</div><div class="field-box">${g('v_examen_fisico')}</div></div>
  <div><div class="section-title">Exámenes Auxiliares</div><div class="field-box">${g('v_examenes_aux')}</div></div>
</div>
<div class="section grid2">
  <div><div class="section-title">Diagnóstico(s)</div><div class="field-box">${g('v_diagnostico')}</div></div>
  <div><div class="section-title">Tratamiento</div><div class="field-box">${g('v_tratamiento')}</div></div>
</div>
<div class="section"><div class="section-title">Receta / Indicaciones</div><div class="field-box">${g('v_prescripcion')}</div></div>
<div class="signature"><div class="sig-box"><br><p>Firma y Sello del Profesional</p></div></div>
<footer>Documento generado por ${clinica} &mdash; ${new Date().toLocaleDateString('es-PE')}</footer>
</body></html>`;

        const w = window.open('', 'AtencionPrint', 'width=900,height=700');
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); }, 400);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg) {
        let data = { title: 'Notificación', icon: 'info', text: 'Acción realizada' };
        if(msg === 'guardado') data = { title: 'Progreso Guardado', icon: 'success', text: 'El formulario se ha guardado correctamente.' };
        else if(msg === 'error') data = { title: 'Error', icon: 'error', text: 'Ocurrió un error al guardar los datos.' };
        Swal.fire({ title: data.title, text: data.text, icon: data.icon, confirmButtonColor: '#0d6efd' })
            .then(() => window.history.replaceState({}, document.title, window.location.pathname + '?id=' + urlParams.get('id')));
    }
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
