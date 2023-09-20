/** @format */
import { useNavigate } from "react-router-dom";

import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { Blurhash } from "react-blurhash";

import "./card.module.scss";
import { MdiCheck } from "../icons/mdiCheck";

import LikeButton from "../buttons/likeButton";
import MarkPlayedButton from "../buttons/markPlayedButton";
import PlayButton from "../buttons/playButton";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client";
import { MdiTelevisionClassic } from "../icons/mdiTelevisionClassic";
import { getRuntimeCompact } from "../../utils/date/time";

/**
 * @typedef {Object} Props
 * @property {import("@jellyfin/sdk/lib/generated-client/models").BaseItemDto} item
 * @property {string}  cardTitle
 * @property {string | number}  cardCaption
 * @property {string} imageBlurhash
 * @property {Array} queryKey
 * @property {string} userId
 * @property {() => {}} onClick
 */

/**
 * @description Hero section for item pages
 * @param {Props}
 * @returns {React.Component}
 */

export const EpisodeCard = ({
	item,
	cardTitle,
	cardCaption,
	imageBlurhash,
	queryKey,
	userId,
	onClick,
}) => {
	const navigate = useNavigate();
	const defaultOnClick = () => {
		navigate(`/episode/${item.Id}`);
	};
	return (
		<CardActionArea
			style={{
				padding: "0.6em",
				borderRadius: "calc(0.6em + 6px)",
			}}
			className="card-container"
			onClick={!!onClick ? onClick : defaultOnClick}
		>
			<MuiCard className="card card-episode" elevation={0}>
				<div className="card-box">
					<div
						className="card-image-container"
						style={{
							aspectRatio: 1.777,
						}}
					>
						{!!item.UserData && (
							<div
								className="card-indicator check"
								style={{
									opacity: item.UserData?.Played
										? 1
										: 0,
								}}
							>
								<MdiCheck />
							</div>
						)}
						{!!imageBlurhash && (
							<Blurhash
								hash={imageBlurhash}
								width={128}
								height={128}
								resolutionX={24}
								resolutionY={24}
								className="card-image-blurhash"
							/>
						)}
						<div className="card-image-icon-container">
							<MdiTelevisionClassic className="card-image-icon" />
						</div>
						<img
							src={window.api.getItemImageUrl(
								item.Id,
								"Primary",
								{
									quality: 90,
									fillHeight: 512,
									fillWidth: 512,
								},
							)}
							style={{
								height: "100%",
								width: "100%",
								opacity: 0,
							}}
							loading="lazy"
							onLoad={(e) => (e.target.style.opacity = 1)}
							className="card-image"
						/>

						<div className="card-overlay">
							<PlayButton
								itemId={item.Id}
								userId={userId}
								itemType={item.Type}
								currentAudioTrack={0}
								currentSubTrack={0}
								currentVideoTrack={0}
								className="card-play-button"
								iconProps={{
									style: { fontSize: "2.5em" },
								}}
								iconOnly
							/>
							<LikeButton
								itemId={item.Id}
								itemName={item.Name}
								isFavorite={item.UserData?.IsFavorite}
								queryKey={queryKey}
								userId={userId}
							/>
							<MarkPlayedButton
								itemId={item.Id}
								itemName={item.Name}
								isPlayed={item.UserData.Played}
								queryKey={queryKey}
								userId={userId}
							/>
						</div>
						{100 > item.UserData?.PlayedPercentage > 0 && (
							<LinearProgress
								variant="determinate"
								value={item.UserData.PlayedPercentage}
								style={{
									position: "absolute",
									left: 0,
									right: 0,
									bottom: 0,
									zIndex: 2,
									height: "6px",
									background:
										"rgb(5 5 5 /  0.5) !important",
									backdropFilter: "blur(5px)",
								}}
								color="primary"
							/>
						)}
					</div>
					<div
						className="card-text-container"
						style={{ display: "block", marginTop: "0.5em" }}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: "1em",
							}}
						>
							<Typography
								variant="subtitle1"
								fontWeight={500}
								textAlign="start"
								noWrap
								style={{
									opacity: 0.9,
								}}
							>
								{cardTitle}
							</Typography>
							<Typography
								variant="subtitle1"
								fontWeight={500}
								noWrap
								textAlign="start"
								style={{ opacity: 0.8, flexShrink: 0 }}
							>
								{getRuntimeCompact(item.RunTimeTicks)}
							</Typography>
						</div>

						<Typography
							variant="subtitle2"
							textAlign="start"
							style={{
								opacity: 0.6,
								display: "-webkit-box",
								overflow: "hidden",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: 3,
							}}
							lineHeight="auto"
						>
							{cardCaption}
						</Typography>
					</div>
				</div>
			</MuiCard>
		</CardActionArea>
	);
};
