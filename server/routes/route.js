import { Router } from "express";
import express from 'express'
import { isAuth } from "../middleware/authMiddleware.js";
import { Register, Login, FetchUser, FetchProjectMember, FetchUserDetails, GetUserProject } from "../controllers/user.js";
import { CreateWorkSpace, GetWorkspace, DeleteWorkspace } from "../controllers/workspace.js";
import { AssignMember, CreateProject, GetProject, GetProjectDetail, DeleteProject, RemoveMember } from "../controllers/project.js";
import { CreateTask, DeleteTask, GetProjectTask, GetUserTask, updateTaskStatus } from "../controllers/task.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
const route = express(Router());

//common routes
route.get('/fetch/workspace', authorizeRoles("admin"), GetWorkspace)
route.post('/fetch/user/project', authorizeRoles("admin", "user"), GetUserProject)
route.post('/fetch/user/task', authorizeRoles("admin", "user"), GetUserTask)
route.post('/fetch/project', authorizeRoles("admin", "user"), GetProject)
route.post('/fetch/project/detail', authorizeRoles("admin", "user"), GetProjectDetail)
route.post("/fetch/project/task", authorizeRoles("admin", "user"), GetProjectTask);
route.put("/update/task/status", authorizeRoles("admin", "user"), updateTaskStatus);

// Auth routes
route.post('/auth/register', authorizeRoles("admin", "user"), Register)
route.post('/auth/login', authorizeRoles("admin", "user"), Login)

//Admin routes
route.post('/admin/create/workspace', authorizeRoles("admin"), CreateWorkSpace)
route.post('/admin/create/project', authorizeRoles("admin"), CreateProject)
route.post('/admin/fetch/user', authorizeRoles("admin", "user"), FetchUser)
route.post('/admin/fetch/user-details', authorizeRoles("admin", "user"), FetchUserDetails)
route.post('/admin/fetch/project/member', authorizeRoles("admin"), FetchProjectMember)
route.put('/admin/assigned-member', authorizeRoles("admin"), AssignMember)
route.put('/admin/remove-member', authorizeRoles("admin"), RemoveMember)
route.post('/admin/create/task', authorizeRoles("admin"), CreateTask)
route.delete('/admin/delete/task/:taskId', authorizeRoles("admin"), DeleteTask)

route.delete('/admin/delete/project/:projectId', authorizeRoles("admin"), DeleteProject)
route.delete('/admin/delete/workspace/:workspaceId', authorizeRoles("admin"), DeleteWorkspace)

route.get('/', (req, res) => {
    res.send("server running ");
})
route.get("/auth/profile", isAuth, async (req, res) => {

    return res.json({
        success: true,
        user: req?.user
    });
});
export default route