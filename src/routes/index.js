const { Router } = require('express');
const router = Router();

const User = require('../models/User');
const Thematic = require('../models/Thematic');
const Bibliography = require('../models/Bibliography');
const Cybergraphy = require('../models/Cybergraphy');
const Subject = require('../models/Subjects');
const Student = require('../models/Student');
const Qualification_Subject = require('../models/Qualification')
const Semi_annual_cut_off = require('../models/Semi_annual_cut_off')
const Teacher = require('../models/Teacher')
const Evaluation = require('../models/Evaluation');

//const Semestre = require('../models/Semestre');
//const Materia = require('../models/Subjects');
//const Docente = require('../models/Docente');
//const Cibergrafia = require('../models/Cybergraphy')


const jwt = require('jsonwebtoken');

//#region (CleanCode)
router.post('/signup', async (req, res) => {
    const { email, password,role,code_User ,status} = req.body;
    const newUser = new User({email, password,role,code_User,status});
    await newUser.save();
		const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});
});
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(401).send('The email doen\' exists');
    if (user.password !== password) return res.status(401).send('Wrong Password');

    const token = jwt.sign({_id: user._id}, 'secretkey');
    const role = user.role;
    const code_User = user.code_User;
    const id_user =user._id;
    return res.status(200).json({token,id_user,role,code_User});
});
async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		//console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}
//#region (User)
router.patch('/update-user-state/:userId', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { status } = req.body; // Nuevo estado del usuario

        // Verificar si el usuario existe antes de actualizar
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar el estado del usuario (o cualquier otro campo que desees)
        if (status !== undefined) {
            user.estado = estado;
        }

        await user.save();

        res.json({ message: 'Estado del usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
    }
});
//#endregion

//#region (Evaluation)
router.get('/evaluation-state',verifyToken,async(req,res)=>{
  try {
    const evaluation = await Evaluation.findOne();
    res.json(evaluation);
  } catch (error) {
    console.error('Error al obtener el estado de la evaluación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para actualizar el estado de la evaluación
router.put('/evaluation-state', async (req, res) => {
  try {
    const { evaluationEnabled } = req.body;
    const updatedEvaluation = await Evaluation.findOneAndUpdate({}, { evaluationEnabled }, { new: true });
    res.json(updatedEvaluation);
  } catch (error) {
    console.error('Error al actualizar el estado de la evaluación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

//#region (Thematic)
router.get('/List-Thematic',verifyToken,async(req,res)=>{
    try{
        const lst_thematic = await Thematic.find(); // Esto obtiene todos los documentos en la colección Semestre
        res.json(lst_thematic);

    }catch(error)
    {
        res.status(500).json({ error: 'Error al obtener la tematica.' });
    }
 });
router.post('/Create-Thematic',verifyToken,async(req,res)=>{
    try {
        const { name, description , id_Subject} = req.body; 
        
        const newThematic = new Thematic({
            name,
            description,id_Subject
        });

        const savedThematic = await newThematic.save(); // Guardar 

        res.status(201).json(savedThematic); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tematica.' });
    }
});
// getThematic ID
router.get('/Get-Thematic-ID/:id', verifyToken, async (req, res) => {
    try {
      const thematic = await Thematic.findById(req.params.id);
  
      if (!thematic) {
        return res.status(404).json({ error: 'Tematica no encontrada' });
      }
  
      res.json(thematic);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tematica.' });
    }
  });

  // Get id Subject
  router.get('/Get-Thematics-By-Subject/:id_subject', verifyToken, async (req, res) => {
    try {
      const idSubject = req.params.id_subject;
      const thematics = await Thematic.find({ id_Subject: idSubject });
  
      if (thematics.length === 0) {
        return res.status(404).json({ error: 'No se encontraron temáticas para el sujeto dado' });
      }
  
      res.json(thematics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las temáticas por sujeto.' });
    }
  });
//#endregion

//#region (Bibliography)
router.post('/Create-Bibliography',verifyToken,async(req,res)=>{
    try {
        const { author, title,editorial,edition,year,id_Subject } = req.body; 
        
        const newBibliography = new Bibliography({
            author, title,editorial,edition,year,id_Subject
        });

        const savedBibliography = await newBibliography.save(); // Guardar 

        res.status(201).json(savedBibliography); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la bibliografia.' });
    }
})
router.get('/List-Bibliography',verifyToken,async(req,res)=>{
    try{
        const lst_Bibliography = await Bibliography.find(); // Esto obtiene todos los documentos en la colección 
        res.json(lst_Bibliography);

    }catch(error)
    {
        res.status(500).json({ error: 'Error al obtener la Bibliografia.' });
    }
})
router.get('/Get-Bibliography-ID/:id', verifyToken, async (req, res) => {
    try {
      const bibliography = await Bibliography.findById(req.params.id);
  
      if (!bibliography) {
        return res.status(404).json({ error: 'Bibliografia no encontrada' });
      }
  
      res.json(bibliography);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la Bibliografia.' });
    }
  });

router.get('/Get-Bibliography-By-Subject/:id_subject', verifyToken, async (req, res) => {
    try {
      const idSubject = req.params.id_subject;
      const _bibliography = await Bibliography.find({ id_Subject: idSubject });
  
      if (_bibliography.length === 0) {
        return res.status(404).json({ error: 'No se encontraron Bibliography para el sujeto dado' });
      }
  
      res.json(_bibliography);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las Bibliography por sujeto.' });
    }
  });
//#endregion

//#region (cybergraphy)
router.post('/Create-cybergraphy',verifyToken,async(req,res)=>{
    try {
        const { author_Cibergrafia, title_Cybergraphy,date_Cybergraphy,Url_Cybergraphy,id_subject } = req.body; 
        
        const newCybergraphy = new Cybergraphy({
            author_Cibergrafia, title_Cybergraphy,date_Cybergraphy,Url_Cybergraphy ,id_subject
        });

        const savedCybergraphy = await newCybergraphy.save(); // Guardar 

        res.status(201).json(savedCybergraphy); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la Cibergrafia.' });
    }
})
router.get('/list-cybergraphy',verifyToken,async(req,res)=>
{
    try{
        const cybergraphy = await Cybergraphy.find(); // Esto obtiene todos los documentos en la colección 
        res.json(cybergraphy);
    }
    catch(error){
        res.status(500).json({ error: 'Error al obtener la cibergrafia.' });
    
    }
})
router.get('/Get-cybergraphy-ID/:id', verifyToken, async (req, res) => {
    try {
      const cybergraphy = await Cybergraphy.findById(req.params.id);
  
      if (!cybergraphy) {
        return res.status(404).json({ error: 'Cybergraphy no encontrada' });
      }
  
      res.json(cybergraphy);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la Cybergraphy.' });
    }
  });

router.get('/Get-cybergraphy-By-Subject/:id_subject', verifyToken, async (req, res) => {
    try {
      const idSubject = req.params.id_subject;
      const _cybergraphy = await Cybergraphy.find({ id_subject: idSubject });
  
      if (_cybergraphy.length === 0) {
        return res.status(404).json({ error: 'No se encontraron cybergraphy para el sujeto dado' });
      }
  
      res.json(_cybergraphy);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las cybergraphy por sujeto.' });
    }
  });
//#endregion

//#region (Qualification)
router.post('/Create-Qualification',verifyToken,async(req,res)=>{
    try {
        const { Qualification, commit_Qualification,Day,Time,id_Subject } = req.body; 
       
        const newQualification = new Qualification_Subject({
            Qualification, commit_Qualification,Day,Time,id_Subject
        });

        const savedQualification = await newQualification.save(); // Guardar 

        res.status(201).json(savedQualification); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la Calificación.' });
    }
})
router.get('/List-Qualifications', verifyToken, async (req, res) => {
    try {
        // Obtener todas las calificaciones desde la base de datos
        const qualifications = await Qualification_Subject.find();

        res.status(200).json(qualifications); // Devolver las calificaciones
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las calificaciones.' });
    }
});
router.get('/List-Qualifications/:id', verifyToken, async (req, res) => {
    const id_Subject = req.params.id;

    try {
        // Obtener todas las calificaciones para el id_Subject dado desde la base de datos
        const qualifications = await Qualification_Subject.find({ id_Subject });

        res.status(200).json(qualifications); // Devolver las calificaciones
    } catch (error) {
        res.status(500).json({ error: 'Error al listar las calificaciones.' });
    }
});
//#endregion

//#region (Subject)
router.post('/create-Subject',verifyToken,async(req,res)=>{
    try {
        const { name, code_Subjects, semester,type_of_matter,id_teacher
        ,methodology,period,Assessment_Status,working_day } = req.body; 
        
        const newSubject = new Subject({
            name, code_Subjects, semester,type_of_matter,id_teacher
            ,methodology,period,Assessment_Status,working_day
        });

        const savedSubject = await newSubject.save(); // Guardar 

        res.status(201).json(savedSubject); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la materia.' });
    }
})
router.get('/List-Subject',verifyToken,async(req,res)=>{
    try{
        const lst_Subject = await Subject.find(); // Esto obtiene todos los documentos en la colección 
        res.json(lst_Subject);

    }catch(error)
    {
        res.status(500).json({ error: 'Error al obtener las materias.' });
    }
})
router.get('/list-Subjects-Teacher',verifyToken, async (req, res) => {
  
const id_teacher = req.query.id_teacher; // Ajusta el nombre del parámetro según lo que estés enviando desde el cliente

  try {
    // Filtrar cursos por el code_User
    const userCourses = await Subject.find({ id_teacher: id_teacher });

    res.json(userCourses);
  } catch (error) {
    console.error('Error al obtener cursos por code_User:', error);
    res.status(500).json({ error: 'Error al obtener cursos por code_User.' });
  }
});
router.get('/List-Subject/:id', verifyToken, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Materia no encontrada.' });
        }
        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la materia.' });
    }
});
router.put('/delete-Subject/:id', verifyToken, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Materia no encontrada.' });
        }
        // Establece el campo deleted en true para indicar que la materia ha sido eliminada
        subject.deleted = true;
        await subject.save();
        res.json({ message: 'Materia eliminada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la materia.' });
    }
});

router.put('/update-Subject/:id', verifyToken, async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subject) {
            return res.status(404).json({ error: 'Materia no encontrada.' });
        }
        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la materia.' });
    }
});
//#endregion


//#region (Student)

router.post('/create-Student',verifyToken,async(req,res)=>{
    try {
        const { code_Student, name_Student, document_Student, subjects,Enrollment_Status } = req.body;
    
        // Crea una instancia del modelo Student con los datos proporcionados
        const newStudent = new Student({
          code_Student,
          name_Student,
          document_Student,
          subjects,
          Enrollment_Status
        });
    
        // Guarda el estudiante en la base de datos
        await newStudent.save();
    
        res.status(201).json({ message: 'Estudiante creado exitosamente', student: newStudent });
      } catch (error) {
        console.error('Error al crear el estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});
router.get('/List-Student/:id', verifyToken, async (req, res) => {
    try {
        const studentId = req.params.id;
        
        // Use findById to get a specific student by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener el estudiante.' });
    }
});
router.get('/get-Student/:codeUser',verifyToken,async(req,res)=>

{
    try{

        // Buscar al estudiante por su código de estudiante
        const student = await Student.findOne({ code_Student: req.params.codeUser });
 
        if (!student) {
            return res.status(404).json({ error: 'student no encontrada' });
          }
          
        // Obtener la lista de IDs de las materias asociadas al estudiante
        const subjectIDs = student.subjects.map(subject => subject.id_Subject);

        // Buscar todas las materias cuyos IDs estén en la lista de subjectIDs
        const subjects = await Subject.find({ _id: { $in: subjectIDs } });

        res.json(subjects);
    }
    catch(error){
        res.status(500).json({ error: 'Error al obtener las materias del estudiante .' });
    
    }
});
router.get('/List-Student',verifyToken,async(req,res)=>{
    try{
        const lst_Student = await Student.find(); // Esto obtiene todos los documentos en la colección 
        res.json(lst_Student);

    }catch(error)
    {
        res.status(500).json({ error: 'Error al obtener los estudiantes.' });
    }
});
// Endpoint para actualizar un estudiante
router.put('/update-student/:id', verifyToken, async (req, res) => {
  try {
    const { code_Student, name_Student, document_Student, subjects, Enrollment_Status } = req.body;
    const studentId = req.params.id;

    // Busca el estudiante por su ID
    const existingStudent = await Student.findById(studentId);

    // Si no se encuentra el estudiante, responde con un error 404
    if (!existingStudent) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Actualiza los campos del estudiante con los nuevos valores
    existingStudent.code_Student = code_Student;
    existingStudent.name_Student = name_Student;
    existingStudent.document_Student = document_Student;
    existingStudent.subjects = subjects;
    existingStudent.Enrollment_Status = Enrollment_Status;

    // Guarda los cambios en la base de datos
    await existingStudent.save();

    res.status(200).json({ message: 'Estudiante actualizado exitosamente', student: existingStudent });
  } catch (error) {
    console.error('Error al actualizar el estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/Delete-Student/:id', verifyToken, async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }
});
//#endregion

//#region (Semi_annual_cut_off)
router.post('/create-Semi_annual_cut_off',verifyToken,async(req,res)=>{
    try {
        const { name, percentage, description,id_Subject } = req.body;
    
        // Crea una instancia del modelo con los datos proporcionados
        const newSemi_annual_cut_off = new Semi_annual_cut_off({
            name, percentage, description,id_Subject
        });
    
        // Guarda en la base de datos
        await newSemi_annual_cut_off.save();
    
        res.status(201).json({ message: 'Corte creado exitosamente', Semi_annual_cut_off: newSemi_annual_cut_off });
      } catch (error) {
        console.error('Error al crear el corte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

router.get('/Get-Semi_annual_cut_off-By-Subject/:id_subject', verifyToken, async (req, res) => {
    try {
      const idSubject = req.params.id_subject;
      const _Semi_annual_cut_off = await Semi_annual_cut_off.find({ id_Subject: idSubject });
  
      if (_Semi_annual_cut_off.length === 0) {
        return res.status(404).json({ error: 'No se encontraron los cortes para el sujeto dado' });
      }
  
      res.json(_Semi_annual_cut_off);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los cortes por sujeto.' });
    }
  });
//#endregion

//#region (Teacher)
router.post('/create-Teacher',verifyToken,async(req,res)=>{
    try {
        const { name, code_Teacher,identification } = req.body; 
        
        const newTeacher = new Teacher({
            name, code_Teacher,identification          
            
        });

        const savedTeacher = await newTeacher.save(); // Guardar 

        res.status(201).json(savedTeacher); // Devolver 
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el docente.' });
    }
});
router.get('/list-Teacher',verifyToken,async(req,res)=>
{
    try{
        const teachers = await Teacher.find(); // Esto obtiene todos los documentos en la colección 
        res.json(teachers);
    }
    catch(error){
        res.status(500).json({ error: 'Error al obtener los docentes.' });
    
    }
});
//Endpoint para buscar docente por id
router.get('/list-Teachers/:id', verifyToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el docente por ID.' });
  }
});

// Endpoint para actualizar un docente
router.put('/update-teacher/:id', verifyToken, async (req, res) => {
  try {
    const { name, code_Teacher, identification } = req.body;
    const teacherId = req.params.id;

    // Busca al docente por su ID
    const existingTeacher = await Teacher.findById(teacherId);

    // Si no se encuentra al docente, responde con un error 404
    if (!existingTeacher) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Actualiza los campos del docente con los nuevos valores
    existingTeacher.name = name;
    existingTeacher.code_Teacher = code_Teacher;
    existingTeacher.identification = identification;

    // Guarda los cambios en la base de datos
    await existingTeacher.save();

    res.status(200).json({ message: 'Docente actualizado exitosamente', teacher: existingTeacher });
  } catch (error) {
    console.error('Error al actualizar el docente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//#endregion

//#endregion


module.exports = router;
