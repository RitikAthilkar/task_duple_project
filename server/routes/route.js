import { Router } from "express";
import express from 'express'
import { isAuth } from "../middleware/authMiddleware.js";
import { Register, Login, FetchUser, FetchProjectMember, FetchUserDetails, GetUserProject } from "../controllers/user.js";
import { CreateWorkSpace, GetWorkspace, DeleteWorkspace } from "../controllers/workspace.js";
import { AssignMember, CreateProject, GetProject, GetProjectDetail, DeleteProject, RemoveMember } from "../controllers/project.js";
import { CreateTask, DeleteTask, GetProjectTask, GetUserTask, updateTaskStatus } from "../controllers/task.js";
const route = express(Router());

//common routes
route.get('/fetch/workspace', GetWorkspace)
route.post('/fetch/user/project', GetUserProject)
route.post('/fetch/user/task', GetUserTask)
route.post('/fetch/project', GetProject)
route.post('/fetch/project/detail', GetProjectDetail)
route.post("/fetch/project/task", GetProjectTask);
route.put("/update/task/status", updateTaskStatus);

// Auth routes
route.post('/auth/register', Register)
route.post('/auth/login', Login)

//Admin routes
route.post('/admin/create/workspace', CreateWorkSpace)
route.post('/admin/create/project', CreateProject)
route.post('/admin/fetch/user', FetchUser)
route.post('/admin/fetch/user-details', FetchUserDetails)
route.post('/admin/fetch/project/member', FetchProjectMember)
route.put('/admin/assigned-member', AssignMember)
route.put('/admin/remove-member', RemoveMember)
route.post('/admin/create/task', CreateTask)
route.delete('/admin/delete/task/:taskId', DeleteTask)

route.delete('/admin/delete/project/:projectId', DeleteProject)
route.delete('/admin/delete/workspace/:workspaceId', DeleteWorkspace)

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