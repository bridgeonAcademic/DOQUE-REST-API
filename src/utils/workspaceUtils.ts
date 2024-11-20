import type { IWorkspace } from "../models/workspaceModel";
import { CustomError } from "./error/customError";
import mailSender from "./mailSender";

export const hasAccess = async (workspace: IWorkspace, userId: string, role: "owner" | "user" = "user") => {
	// to find if the user is a member of the workspace. If not, throw an error

	if (role === "owner" && workspace.createdBy.toString() !== userId) {
		throw new CustomError("You do not have permission to do this!", 403);
	}

	if (workspace.members.every((member) => member.toString() !== userId)) {
		throw new CustomError("You are not a member of this workspace", 403);
	}
};

export const sendInvitationEmail = async (email: string, workspace: IWorkspace) => {
	const title = "Invitation to Join Workspace";
	const body = `
			<h2>Hello,</h2>
			<p>You have been invited to join the workspace: <strong>${workspace.name}</strong>.</p>
			<p>Click the link below to accept the invitation:</p>
			<a href="${process.env.CLIENT_URL}/${workspace._id}/accept-invitation" style="padding: 10px 15px; color: white; background-color: #007bff; border-radius: 5px; text-decoration: none;">Accept Invitation</a>
			<p>If you didn't request this invitation, please ignore this email.</p>
			<p>Best Regards,</p>
			<p>Team DOQUE</p>
		`;
	const info = await mailSender(email, title, body);
	return info;
};
