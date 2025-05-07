import dotenv from 'dotenv';
import { CLIENT_BASE_URL } from 'src/utils/env';
dotenv.config();

export const adminSignup = (username: string, tempPassword: string) => `
<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			margin: 0px auto;
		"
	>
		<table
			style="
				border: 0;
				display: flex;
				font-family: Roboto, Arial;
				flex-direction: column;
				align-items: center;
				align-self: center;
			"
			align="center"
			width="500px"
		>
			<tbody>
				<tr style="text-align: center">
					<img
						src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
						alt="first-man-logo"
						style="width: 15em"
						height="auto"
					/>
					<hr style="width: 500px" />
				</tr>
				<tr>
					<td>
						<h2>Hey Kris,</h2>
                        <h3>You have been invited to become an administrator.</h3>

                        <p>This is an auto-generated message from <a href="https://1st-man.com" 
                            target=_blank"> 1st Man </a>, inviting you to set up your account. 
                            Once you do, you'll be able to manage your profile, invite and remove users, 
                            upload content, manage content and manage communities.
                            
                            <br> <br>
                            This email message contains a link that will get you started.
                        </p>
                        <p>Your username is: <strong>${username}</strong> <br> Your temporary password is:<strong> ${tempPassword} </strong></p>
    
      
                    <br />

						<a
							rel="noopener"
							target="_blank"
							href="${CLIENT_BASE_URL}/onboarding"
							style="
								background-color: #2bb2f1;
								text-decoration: none;
								border-radius: 100px;
								color: #ffffff;
								border-radius: 50px;
								width: 149px;
								height: 40px;
								box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
								padding: 15px 24px;
							"
							align="center"
						>
							<span style="font-size: 16px; line-height: 20px; font-weight: bold"
								>Create your profile</span
							>
						</a>
						<p style="font-size: 14px;"> <br>
                            If you have any questions and feedback please contact us through support
                            at support.email@domain.com
                        </p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>`;

export const passwordLink = (username: string, link: string) => ` <div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <h2>Hi ${username},</h2>
        <h3>We see you need a password reset!</h3>
        <p>
          Someone requested a password reset for this account. To reset your password, click the button below. If this
          wasn&apos;t you, feel free to ignore this email.
        </p>

        <br />

        <br />

        <a
          rel="noopener"
          target="_blank"
          href="${link}"
          style="
            background-color: #2bb2f1;
            text-decoration: none;
            border-radius: 100px;
            color: #ffffff;
            border-radius: 50px;
            width: 149px;
            height: 40px;
            box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
            padding: 15px 24px;
          "
          align="center"
        >
          <span style="font-size: 16px; line-height: 20px; font-weight: bold"
            >Reset Password</span
          >
        </a>
        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>
`;

export const userRegistration = (userId: string) => `<div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <h2>Your account has been created successfully!</h2>
        <p>
          Hi there <br/>
          An account has been created using this email address. To verify your email, click the button below and get
          one step closer to viewing our exclusive content.
        </p>

        <br />

        <a
          rel="noopener"
          target="_blank"
          href="${CLIENT_BASE_URL}/verify-email/${userId}"
          style="
            background-color: #2bb2f1;
            text-decoration: none;
            border-radius: 100px;
            color: #ffffff;
            border-radius: 50px;
            width: 149px;
            height: 40px;
            box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
            padding: 15px 24px;
          "
          align="center"
        >
          <span style="font-size: 16px; line-height: 20px; font-weight: bold">Verify Now</span>
        </a>
        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>`;

export const passwordChanged = (username: string, loginlink: string) => `<div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <h3>Hi ${username},</h3>
        <h3>Your 1st Man account password has been changed successfully!</h3>

        <br />

        <a
          rel="noopener"
          target="_blank"
          href=${loginlink}
          style="
            background-color: #2bb2f1;
            text-decoration: none;
            border-radius: 100px;
            color: #ffffff;
            border-radius: 50px;
            width: 149px;
            height: 40px;
            box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
            padding: 15px 24px;
          "
          align="center"
        >
          <span style="font-size: 16px; line-height: 20px; font-weight: bold">Login</span>
        </a>
        <p>
          <br />
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
        <br />
        <p style="font-size: 14px; text-align: center">
          If you have any questions and feedback please contact us through support at
          support.email@domain.com
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>`;

export const successfulPaymentBody = (username: string, link: string) => ` <div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <h2>We have received your payment!</h2>
        <h2>Hi ${username},</h2>
        <p>
          Thank you for subscribing to 1STMAN. Please see your invoice below.
        </p>
        <br />
        <a
          rel="noopener"
          target="_blank"
          href="${link}"
          style="
            background-color: #2bb2f1;
            text-decoration: none;
            border-radius: 100px;
            color: #ffffff;
            border-radius: 50px;
            width: 149px;
            height: 40px;
            box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
            padding: 15px 24px;
          "
          align="center"
        >
          <span style="font-size: 16px; line-height: 20px; font-weight: bold"
            >View my invoice</span
          >
        </a>
        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>
`;

export const failedPaymentBody = (username: string, link: string) => ` <div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <h2>Your payment was unsuccessful</h2>
        <p>
          Hi ${username}, <br/>
          Unfortunately your payment was not successful. Click the button below to try again.
        </p>

        <br />

        <a
          rel="noopener"
          target="_blank"
          href="${link}"
          style="
            background-color: #2bb2f1;
            text-decoration: none;
            border-radius: 100px;
            color: #ffffff;
            border-radius: 50px;
            width: 149px;
            height: 40px;
            box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
            padding: 15px 24px;
          "
          align="center"
        >
          <span style="font-size: 16px; line-height: 20px; font-weight: bold"
            >Retry Payment</span
          >
        </a>
        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>
`;

export const deletedSubscriptionBody = (username: string, link: string) => ` <body
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
"
>
<img
  src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
  alt="first-man-logo"
  style="width: 15em"
  height="auto"
/>
<br />
<hr style="width: 500px" />
<div
  style="
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    width: 500px;
  "
>
  <h2>Hi ${username},</h2>

  <p>
    We see you have suspended your subscription on 1st Man!
    We love to always see you around, you can alway enjoy our premium content at anytime, 
    please click on the button below to continue.
  </p>

  <br />

  <a
    rel="noopener"
    target="_blank"
    href="${link}"
    style="
      background-color: #2bb2f1;
      text-decoration: none;
      border-radius: 100px;
      color: #ffffff;
      border-radius: 50px;
      width: 149px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15),
        0px 1px 3px rgba(0, 0, 0, 0.3);
      padding: 10px 24px;
    "
  >
    <span style="font-size: 16px; line-height: 20px; font-weight: bold"
      >Subscribe</span
    >
  </a>
  <p>
    <br />
    Kind regards <br />
    The 1STMAN Team
  </p>
</div>
</body>
`;

export const accountDeactivationBody = (
	username: string,
	removalReason: string,
	description: string
) => ` <div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <p>
          Dear ${username}, <br />
          <br />
          This email is to inform you that a super admin has removed you from our platform as a
          admin for the following reasons: <strong>${removalReason}</strong>. <br />
          <br />
          They have provided a description: <strong>${description}.</strong> <br />
          <br />
          If you believe that your account has been deactivated by mistake, please reach out to
          support. <br />
          <br />
          support.email@domain.com
        </p>

        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>
`;

export const inviteBody = (username: string, link: string, userRole: string) => `
<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			margin: 0px auto;
		"
	>
		<table
			style="
				border: 0;
				display: flex;
				font-family: Roboto, Arial;
				flex-direction: column;
				align-items: center;
				align-self: center;
			"
			align="center"
			width="500px"
		>
			<tbody>
				<tr style="text-align: center">
					<img
						src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
						alt="first-man-logo"
						style="width: 15em"
						height="auto"
					/>
					<hr style="width: 500px" />
				</tr>
				<tr>
					<td>
						<h2>You have been invited to join 1STMAN!</h2>
						<p>
							Hi ${username}, <br />
              You have been invited to join the 1STMAN platform as a ${userRole} by Kris Sturmey.
							Click on the button below to accept the invite and gain access to the platform today.
						</p>

						<br />

						<a
							rel="noopener"
							target="_blank"
							href=${link}
							style="
								background-color: #2bb2f1;
								text-decoration: none;
								border-radius: 100px;
								color: #ffffff;
								border-radius: 50px;
								width: 149px;
								height: 40px;
								box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
								padding: 15px 24px;
							"
							align="center"
						>
							<span style="font-size: 16px; line-height: 20px; font-weight: bold"
								>Join the platform</span
							>
						</a>
						<p>
							<br />
							Kind regards <br />
							The 1STMAN Team
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
`;

export const accountReactivationBody = (username: string) => ` <div
style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0px auto;
"
>
<table
  style="
    border: 0;
    display: flex;
    font-family: Roboto, Arial;
    flex-direction: column;
    align-items: center;
    align-self: center;
  "
  align="center"
  width="500px"
>
  <tbody>
    <tr style="text-align: center">
      <img
        src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
        alt="first-man-logo"
        style="width: 15em"
        height="auto"
      />
      <hr style="width: 500px" />
    </tr>
    <tr>
      <td>
        <p>
          Dear ${username}, <br />
          <br />
          This email is to inform you that a super admin has restored your deactivated account</strong>. <br />
          <br />
          <br />
          If you have any reservation, please reach out to
          support. <br />
          <br />
          support.email@domain.com
        </p>

        <p>
          <br />
          Kind regards <br />
          The 1STMAN Team
        </p>
      </td>
    </tr>
  </tbody>
</table>
</div>
`;

export const processedVideoBody = (username: string, link: string, videoTitle: string) => `
<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			margin: 0px auto;
		"
	>
		<table
			style="
				border: 0;
				display: flex;
				font-family: Roboto, Arial;
				flex-direction: column;
				align-items: center;
				align-self: center;
			"
			align="center"
			width="500px"
		>
			<tbody>
				<tr style="text-align: center">
					<img
						src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
						alt="first-man-logo"
						style="width: 15em"
						height="auto"
					/>
					<hr style="width: 500px" />
				</tr>
				<tr>
					<td>
						<h2>Your video is ready for streaming!</h2>
						<p>
							Hi ${username}, <br />
							Your video, ${videoTitle}, has been processed for streaming.
              Click “Take me there” to view your video.
						</p>

						<br />

						<a
							rel="noopener"
							target="_blank"
							href="${link}"
							style="
								background-color: #2bb2f1;
								text-decoration: none;
								border-radius: 100px;
								color: #ffffff;
								border-radius: 50px;
								width: 149px;
								height: 40px;
								box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
								padding: 15px 24px;
							"
							align="center"
						>
							<span style="font-size: 16px; line-height: 20px; font-weight: bold"
								>Take me there</span
							>
						</a>
						<p>
							<br />
							Kind regards <br />
							The 1STMAN Team
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
`;

export const videoNotificationBody = (username: string, videoTitle: string, link: string) => `
<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			margin: 0px auto;
		"
	>
		<table
			style="
				border: 0;
				display: flex;
				font-family: Roboto, Arial;
				flex-direction: column;
				align-items: center;
				align-self: center;
			"
			align="center"
			width="500px"
		>
			<tbody>
				<tr style="text-align: center">
					<img
						src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
						alt="first-man-logo"
						style="width: 15em"
						height="auto"
					/>
					<hr style="width: 500px" />
				</tr>
				<tr>
					<td>
						<h2>Your video was uploaded successfully!</h2>
						<p>
							Hi ${username}, <br />
							Your video, ${videoTitle}, has been uploaded successfully.
              Click “Take me there” to view your video.
						</p>

						<br />

						<a
							rel="noopener"
							target="_blank"
							href=${link}
							style="
								background-color: #2bb2f1;
								text-decoration: none;
								border-radius: 100px;
								color: #ffffff;
								border-radius: 50px;
								width: 149px;
								height: 40px;
								box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
								padding: 15px 24px;
							"
							align="center"
						>
							<span style="font-size: 16px; line-height: 20px; font-weight: bold"
								>Take me there</span
							>
						</a>
						<p>
							<br />
							Kind regards <br />
							The 1STMAN Team
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
`;

export const processedVideoNotificationBody = (
	username: string,
	videoTitle: string,
	link: string,
	category: string
) => `
<div
		style="
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			width: 100%;
			margin: 0px auto;
		"
	>
		<table
			style="
				border: 0;
				display: flex;
				font-family: Roboto, Arial;
				flex-direction: column;
				align-items: center;
				align-self: center;
			"
			align="center"
			width="500px"
		>
			<tbody>
				<tr style="text-align: center">
					<img
						src="https://s3.eu-west-1.amazonaws.com/prod-1st-man.com/assets/icon-text-logo.3d9f0dac.png"
						alt="first-man-logo"
						style="width: 15em"
						height="auto"
					/>
					<hr style="width: 500px" />
				</tr>
				<tr>
					<td>
						<h2>Your video was processed successfully!</h2>
						<p>
							Hi ${username}, <br />
							Your video, ${videoTitle} has been processed and transcoded successfully.
              Click “Take me there” to view your video.
						</p>

						<br />

						<a
							rel="noopener"
							target="_blank"
							href=${link}
							style="
								background-color: #2bb2f1;
								text-decoration: none;
								border-radius: 100px;
								color: #ffffff;
								border-radius: 50px;
								width: 149px;
								height: 40px;
								box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3);
								padding: 15px 24px;
							"
							align="center"
						>
							<span style="font-size: 16px; line-height: 20px; font-weight: bold"
								>Take me there</span
							>
						</a>
						<p>
							<br />
							Kind regards <br />
							The 1STMAN Team
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
`;
