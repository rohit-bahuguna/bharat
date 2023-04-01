import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DropdownToggle, DropdownMenu, Dropdown } from 'reactstrap';
import { Icon } from '../../../../components/Component';
import { LinkList, LinkItem } from '../../../../components/links/Links';
import UserAvatar from '../../../../components/user/UserAvatar';
import { logout } from '../../../../redux/feateres/useSlice';

const User = () => {
	const [open, setOpen] = useState(false);
	const toggle = () => setOpen(prevState => !prevState);
	const user = useSelector(state => state.user.user);
	const dispatch = useDispatch();
	const handleSignout = () => {
		dispatch(logout());
	};

	return (
		<Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
			<DropdownToggle
				tag="a"
				href="#toggle"
				className="dropdown-toggle"
				onClick={ev => {
					ev.preventDefault();
				}}>
				<div className="user-toggle">
					<UserAvatar icon="user-alt" className="sm" />
					<div className="user-info d-none d-md-block">
						<div className="user-status">
							{user.role}
						</div>
						<div className="user-name dropdown-indicator">
							{user.name}
						</div>
					</div>
				</div>
			</DropdownToggle>
			<DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
				<div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
					<div className="user-card sm">
						<div className="user-avatar">
							<span>
								{user.name.slice()[0]}
							</span>
						</div>
						<div className="user-info">
							<span className="lead-text">
								{user.name}
							</span>
							<span className="sub-text">
								{user.email}
							</span>
						</div>
					</div>
				</div>
				<div className="dropdown-inner">
					<LinkList>
						<LinkItem
							link="/user-profile-regular"
							icon="user-alt"
							onClick={toggle}>
							View Profile
						</LinkItem>
						<LinkItem
							link="/user-profile-setting"
							icon="setting-alt"
							onClick={toggle}>
							Account Setting
						</LinkItem>
						<LinkItem
							link="/user-profile-activity"
							icon="activity-alt"
							onClick={toggle}>
							Login Activity
						</LinkItem>
					</LinkList>
				</div>
				<div className="dropdown-inner">
					<LinkList>
						<Link
							to={`${process.env.PUBLIC_URL}/auth-login`}
							onClick={handleSignout}>
							<Icon name="signout" />
							<span>Sign Out</span>
						</Link>
					</LinkList>
				</div>
			</DropdownMenu>
		</Dropdown>
	);
};

export default User;
